# -*- coding: utf-8 -*-
# code generated by Prisma. DO NOT EDIT.
# pyright: reportUnusedImport=false
# fmt: off
from __future__ import annotations

# global imports for type checking
from builtins import bool as _bool
from builtins import int as _int
from builtins import float as _float
from builtins import str as _str
import sys
import decimal
import datetime
from typing import (
    TYPE_CHECKING,
    Optional,
    Iterable,
    Iterator,
    Sequence,
    Callable,
    ClassVar,
    NoReturn,
    TypeVar,
    Generic,
    Mapping,
    Tuple,
    Union,
    List,
    Dict,
    Type,
    Any,
    Set,
    overload,
    cast,
)
from typing_extensions import TypedDict, Literal


LiteralString = str
# -- template client.py.jinja --
import warnings
import logging
from datetime import timedelta
from pathlib import Path
from types import TracebackType

from pydantic import BaseModel

from . import types, models, errors, actions
from .types import DatasourceOverride, HttpConfig, MetricsFormat
from ._types import BaseModelT, PrismaMethod
from .bases import _PrismaModel
from .engine import AbstractEngine, QueryEngine, TransactionId
from .builder import QueryBuilder, dumps
from .generator.models import EngineType, OptionalValueFromEnvVar, BinaryPaths
from ._compat import removeprefix, model_parse
from ._constants import DEFAULT_CONNECT_TIMEOUT, DEFAULT_TX_MAX_WAIT, DEFAULT_TX_TIMEOUT
from ._raw_query import deserialize_raw_results
from ._metrics import Metrics

__all__ = (
    'ENGINE_TYPE',
    'SCHEMA_PATH',
    'BINARY_PATHS',
    'Batch',
    'Prisma',
    'Client',
    'load_env',
    'register',
    'get_client',
)

log: logging.Logger = logging.getLogger(__name__)

SCHEMA_PATH = Path('/Users/zach/Dropbox/code/capsule/prisma/schema.prisma')
PACKAGED_SCHEMA_PATH = Path(__file__).parent.joinpath('schema.prisma')
ENGINE_TYPE: EngineType = EngineType.binary
BINARY_PATHS = model_parse(BinaryPaths, {'queryEngine': {'darwin-arm64': '/Users/zach/.cache/prisma-python/binaries/5.4.2/ac9d7041ed77bcc8a8dbd2ab6616b39013829574/node_modules/prisma/query-engine-darwin-arm64'}, 'introspectionEngine': {}, 'migrationEngine': {}, 'libqueryEngine': {}, 'prismaFmt': {}})

RegisteredClient = Union['Prisma', Callable[[], 'Prisma']]
_registered_client: Optional[RegisteredClient] = None


class UseClientDefault:
    """For certain parameters such as `timeout=...` we can make our intent more clear
    by typing the parameter with this class rather than using None, for example:

    ```py
    def connect(timeout: Union[int, timedelta, UseClientDefault] = UseClientDefault()) -> None: ...
    ```

    relays the intention more clearly than:

    ```py
    def connect(timeout: Union[int, timedelta, None] = None) -> None: ...
    ```

    This solution also allows us to indicate an "unset" state that is uniquely distinct
    from `None` which may be useful in the future.
    """


_USE_CLIENT_DEFAULT = UseClientDefault()


def load_env(*, override: bool = False, **kwargs: Any) -> None:
    """Load environemntal variables from dotenv files

    Loads from the following files relative to the current
    working directory:

    - .env
    - prisma/.env
    """
    from dotenv import load_dotenv

    load_dotenv('.env', override=override, **kwargs)
    load_dotenv('prisma/.env', override=override, **kwargs)


def register(client: RegisteredClient) -> None:
    """Register a client instance to be retrieved by `get_client()`

    This function _must_ only be called once, preferrably as soon as possible
    to avoid any potentially confusing errors with threads or processes.
    """
    global _registered_client

    if _registered_client is not None:
        raise errors.ClientAlreadyRegisteredError()

    if not isinstance(client, Prisma) and not callable(client):
        raise TypeError(
            f'Expected either a {Prisma} instance or a function that returns a {Prisma} but got {client} instead.'
        )

    _registered_client = client


def get_client() -> 'Prisma':
    """Get the registered client instance

    Raises errors.ClientNotRegisteredError() if no client instance has been registered.
    """
    registered = _registered_client
    if registered is None:
        raise errors.ClientNotRegisteredError() from None

    if isinstance(registered, Prisma):
        return registered

    client = registered()
    if not isinstance(client, Prisma):  # pyright: ignore[reportUnnecessaryIsInstance]
        raise TypeError(
            f'Registered function returned {client} instead of a {Prisma} instance.'
        )

    return client


class Prisma:
    user: 'actions.UserActions[models.User]'
    partnerrequest: 'actions.PartnerRequestActions[models.PartnerRequest]'
    partnership: 'actions.PartnershipActions[models.Partnership]'
    capsule: 'actions.CapsuleActions[models.Capsule]'

    __slots__ = (
        'user',
        'partnerrequest',
        'partnership',
        'capsule',
        '__engine',
        '__copied',
        '_tx_id',
        '_datasource',
        '_log_queries',
        '_http_config',
        '_connect_timeout',
        '_active_provider',
    )

    def __init__(
        self,
        *,
        use_dotenv: bool = True,
        log_queries: bool = False,
        auto_register: bool = False,
        datasource: Optional[DatasourceOverride] = None,
        connect_timeout: Union[int, timedelta] = DEFAULT_CONNECT_TIMEOUT,
        http: Optional[HttpConfig] = None,
    ) -> None:
        self.user = actions.UserActions[models.User](self, models.User)
        self.partnerrequest = actions.PartnerRequestActions[models.PartnerRequest](self, models.PartnerRequest)
        self.partnership = actions.PartnershipActions[models.Partnership](self, models.Partnership)
        self.capsule = actions.CapsuleActions[models.Capsule](self, models.Capsule)

        # NOTE: if you add any more properties here then you may also need to forward
        # them in the `_copy()` method.
        self.__engine: Optional[AbstractEngine] = None
        self._active_provider = 'postgresql'
        self._log_queries = log_queries
        self._datasource = datasource

        if isinstance(connect_timeout, int):
            message = (
                'Passing an int as `connect_timeout` argument is deprecated '
                'and will be removed in the next major release. '
                'Use a `datetime.timedelta` instance instead.'
            )
            warnings.warn(message, DeprecationWarning, stacklevel=2)
            connect_timeout = timedelta(seconds=connect_timeout)

        self._connect_timeout = connect_timeout
        self._http_config: HttpConfig = http or {}
        self._tx_id: Optional[TransactionId] = None
        self.__copied: bool = False

        if use_dotenv:
            load_env()

        if auto_register:
            register(self)

    def __del__(self) -> None:
        # Note: as the transaction manager holds a reference to the original
        # client as well as the transaction client the original client cannot
        # be `free`d before the transaction is finished. So stopping the engine
        # here should be safe.
        if self.__engine is not None and not self.__copied:
            log.debug('unclosed client - stopping engine')
            engine = self.__engine
            self.__engine = None
            engine.stop()

    async def __aenter__(self) -> 'Prisma':
        await self.connect()
        return self

    async def __aexit__(
        self,
        exc_type: Optional[Type[BaseException]],
        exc: Optional[BaseException],
        exc_tb: Optional[TracebackType],
    ) -> None:
        if self.is_connected():
            await self.disconnect()

    def is_registered(self) -> bool:
        """Returns True if this client instance is registered"""
        try:
            return get_client() is self
        except errors.ClientNotRegisteredError:
            return False

    def is_connected(self) -> bool:
        """Returns True if the client is connected to the query engine, False otherwise."""
        return self.__engine is not None

    async def connect(
        self,
        timeout: Union[int, timedelta, UseClientDefault] = _USE_CLIENT_DEFAULT,
    ) -> None:
        """Connect to the Prisma query engine.

        It is required to call this before accessing data.
        """
        if isinstance(timeout, UseClientDefault):
            timeout = self._connect_timeout

        if isinstance(timeout, int):
            message = (
                'Passing an int as `timeout` argument is deprecated '
                'and will be removed in the next major release. '
                'Use a `datetime.timedelta` instance instead.'
            )
            warnings.warn(message, DeprecationWarning, stacklevel=2)
            timeout = timedelta(seconds=timeout)

        if self.__engine is None:
            self.__engine = self._create_engine(dml_path=PACKAGED_SCHEMA_PATH)

        datasources: Optional[List[types.DatasourceOverride]] = None
        if self._datasource is not None:
            ds = self._datasource.copy()
            ds.setdefault('name', 'db')
            datasources = [ds]

        await self.__engine.connect(
            timeout=timeout,
            datasources=datasources,
        )

    async def disconnect(self, timeout: Union[float, timedelta, None] = None) -> None:
        """Disconnect the Prisma query engine."""
        if self.__engine is not None:
            engine = self.__engine
            self.__engine = None
            if isinstance(timeout, float):
                message = (
                    'Passing a float as `timeout` argument is deprecated '
                    'and will be removed in the next major release. '
                    'Use a `datetime.timedelta` instead.'
                )
                warnings.warn(message, DeprecationWarning, stacklevel=2)
                timeout = timedelta(seconds=timeout)
            await engine.aclose(timeout=timeout)
            engine.stop(timeout=timeout)

    async def execute_raw(self, query: LiteralString, *args: Any) -> int:
        resp = await self._execute(
            method='execute_raw',
            arguments={
                'query': query,
                'parameters': args,
            },
            model=None,
        )
        return int(resp['data']['result'])

    @overload
    async def query_first(
        self,
        query: LiteralString,
        *args: Any,
    ) -> dict[str, Any]:
        ...

    @overload
    async def query_first(
        self,
        query: LiteralString,
        *args: Any,
        model: Type[BaseModelT],
    ) -> Optional[BaseModelT]:
        ...

    async def query_first(
        self,
        query: LiteralString,
        *args: Any,
        model: Optional[Type[BaseModelT]] = None,
    ) -> Union[Optional[BaseModelT], dict[str, Any]]:
        """This function is the exact same as `query_raw()` but returns the first result.

        If model is given, the returned record is converted to the pydantic model first,
        otherwise a raw dictionary will be returned.
        """
        results: Sequence[Union[BaseModelT, dict[str, Any]]]
        if model is not None:
            results = await self.query_raw(query, *args, model=model)
        else:
            results = await self.query_raw(query, *args)

        if not results:
            return None

        return results[0]

    @overload
    async def query_raw(
        self,
        query: LiteralString,
        *args: Any,
    ) -> List[dict[str, Any]]:
        ...

    @overload
    async def query_raw(
        self,
        query: LiteralString,
        *args: Any,
        model: Type[BaseModelT],
    ) -> List[BaseModelT]:
        ...

    async def query_raw(
        self,
        query: LiteralString,
        *args: Any,
        model: Optional[Type[BaseModelT]] = None,
    ) -> Union[List[BaseModelT], List[dict[str, Any]]]:
        """Execute a raw SQL query against the database.

        If model is given, each returned record is converted to the pydantic model first,
        otherwise results will be raw dictionaries.
        """
        resp = await self._execute(
            method='query_raw',
            arguments={
                'query': query,
                'parameters': args,
            },
            model=model,
        )
        result = resp['data']['result']
        if model is not None:
            return deserialize_raw_results(result, model=model)

        return deserialize_raw_results(result)

    def batch_(self) -> 'Batch':
        """Returns a context manager for grouping write queries into a single transaction."""
        return Batch(client=self)

    def tx(
        self,
        *,
        max_wait: Union[int, timedelta] = DEFAULT_TX_MAX_WAIT,
        timeout: Union[int, timedelta] = DEFAULT_TX_TIMEOUT,
    ) -> 'TransactionManager':
        """Returns a context manager for executing queries within a database transaction.

        Entering the context manager returns a new Prisma instance wrapping all
        actions within a transaction, queries will be isolated to the Prisma instance and
        will not be commited to the database until the context manager exits.

        By default, Prisma will wait a maximum of 2 seconds to acquire a transaction from the database. You can modify this
        default with the `max_wait` argument which accepts a value in milliseconds or `datetime.timedelta`.

        By default, Prisma will cancel and rollback ay transactions that last longer than 5 seconds. You can modify this timeout
        with the `timeout` argument which accepts a value in milliseconds or `datetime.timedelta`.

        Example usage:

        ```py
        async with client.tx() as transaction:
            user1 = await client.user.create({'name': 'Robert'})
            user2 = await client.user.create({'name': 'Tegan'})
        ```

        In the above example, if the first database call succeeds but the second does not then neither of the records will be created.
        """
        return TransactionManager(client=self, max_wait=max_wait, timeout=timeout)

    def is_transaction(self) -> bool:
        """Returns True if the client is wrapped within a transaction"""
        return self._tx_id is not None

    @overload
    async def get_metrics(
        self,
        format: Literal['json'] = 'json',
        *,
        global_labels: dict[str, str] | None = None,
    ) -> Metrics:
        ...

    @overload
    async def get_metrics(
        self,
        format: Literal['prometheus'],
        *,
        global_labels: dict[str, str] | None = None,
    ) -> str:
        ...

    async def get_metrics(
        self,
        format: MetricsFormat = 'json',
        *,
        global_labels: dict[str, str] | None = None,
    ) -> str | Metrics:
        """Metrics give you a detailed insight into how the Prisma Client interacts with your database.

        You can retrieve metrics in either JSON or Prometheus formats.

        For more details see https://www.prisma.io/docs/concepts/components/prisma-client/metrics.
        """
        response = await self._engine.metrics(format=format, global_labels=global_labels)
        if format == 'prometheus':
            # For the prometheus format we return the response as-is
            assert isinstance(response, str)
            return response

        return model_parse(Metrics, response)

    # TODO: don't return Any
    async def _execute(
        self,
        method: PrismaMethod,
        arguments: dict[str, Any],
        model: type[BaseModel] | None = None,
        root_selection: list[str] | None = None
    ) -> Any:
        builder = QueryBuilder(
            method=method,
            model=model,
            arguments=arguments,
            root_selection=root_selection,
        )
        return await self._engine.query(builder.build(), tx_id=self._tx_id)

    def _copy(self) -> 'Prisma':
        """Return a new Prisma instance using the same engine process (if connected).

        This is only intended for private usage, there are no guarantees around this API.
        """
        new = Prisma(
            use_dotenv=False,
            http=self._http_config,
            datasource=self._datasource,
            log_queries=self._log_queries,
            connect_timeout=self._connect_timeout,
        )
        new.__copied = True

        if self.__engine is not None:
            new._engine = self.__engine

        return new

    def _create_engine(self, dml_path: Path = PACKAGED_SCHEMA_PATH) -> AbstractEngine:
        if ENGINE_TYPE == EngineType.binary:
            return QueryEngine(dml_path=dml_path, log_queries=self._log_queries, **self._http_config)

        raise NotImplementedError(f'Unsupported engine type: {ENGINE_TYPE}')

    @property
    def _engine_class(self) -> Type[AbstractEngine]:
        if ENGINE_TYPE == EngineType.binary:
            return QueryEngine
        else:  # pragma: no cover
            raise RuntimeError(f'Unhandled engine type: {ENGINE_TYPE}')

    @property
    def _engine(self) -> AbstractEngine:
        engine = self.__engine
        if engine is None:
            raise errors.ClientNotConnectedError()
        return engine

    @_engine.setter
    def _engine(self, engine: AbstractEngine) -> None:
        self.__engine = engine

    def _make_sqlite_datasource(self) -> DatasourceOverride:
        return {
            'name': 'db',
            'url': self._make_sqlite_url(self._default_datasource['url']),
        }

    def _make_sqlite_url(self, url: str, *, relative_to: Path = SCHEMA_PATH.parent) -> str:
        url_path = removeprefix(removeprefix(url, 'file:'), 'sqlite:')
        if url_path == url:
            return url

        if Path(url_path).is_absolute():
            return url

        return f'file:{relative_to.joinpath(url_path).resolve()}'

    @property
    def _default_datasource(self) -> DatasourceOverride:
        return {
            'name': 'db',
            'url': OptionalValueFromEnvVar(**{'value': None, 'fromEnvVar': 'POSTGRES_PRISMA_URL'}).resolve(),
        }


class TransactionManager:
    """Context manager for wrapping a Prisma instance within a transaction.

    This should never be created manually, instead it should be used
    through the Prisma.tx() method.
    """

    def __init__(self, *, client: Prisma, max_wait: Union[int, timedelta], timeout: Union[int, timedelta]) -> None:
        self.__client = client

        if isinstance(max_wait, int):
            message = (
                'Passing an int as `max_wait` argument is deprecated '
                'and will be removed in the next major release. '
                'Use a `datetime.timedelta` instance instead.'
            )
            warnings.warn(message, DeprecationWarning, stacklevel=3)
            max_wait = timedelta(milliseconds=max_wait)

        self._max_wait = max_wait

        if isinstance(timeout, int):
            message = (
                'Passing an int as `timeout` argument is deprecated '
                'and will be removed in the next major release. '
                'Use a `datetime.timedelta` instance instead.'
            )
            warnings.warn(message, DeprecationWarning, stacklevel=3)
            timeout = timedelta(milliseconds=timeout)

        self._timeout = timeout

        self._tx_id: Optional[TransactionId] = None

    async def start(self, *, _from_context: bool = False) -> Prisma:
        """Start the transaction and return the wrapped Prisma instance"""
        if self.__client.is_transaction():
            # if we were called from the context manager then the stacklevel
            # needs to be one higher to warn on the actual offending code
            warnings.warn(
                'The current client is already in a transaction. This can lead to surprising behaviour.',
                UserWarning,
                stacklevel=3 if _from_context else 2
            )

        tx_id = await self.__client._engine.start_transaction(
            content=dumps(
                {
                    'timeout': int(self._timeout.total_seconds() * 1000),
                    'max_wait': int(self._max_wait.total_seconds() * 1000),
                }
            ),
        )
        self._tx_id = tx_id
        client = self.__client._copy()
        client._tx_id = tx_id
        return client

    async def commit(self) -> None:
        """Commit the transaction to the database, this transaction will no longer be usable"""
        if self._tx_id is None:
            raise errors.TransactionNotStartedError()

        await self.__client._engine.commit_transaction(self._tx_id)

    async def rollback(self) -> None:
        """Do not commit the changes to the database, this transaction will no longer be usable"""
        if self._tx_id is None:
            raise errors.TransactionNotStartedError()

        await self.__client._engine.rollback_transaction(self._tx_id)

    async def __aenter__(self) -> Prisma:
        return await self.start(_from_context=True)

    async def __aexit__(
        self,
        exc_type: Optional[Type[BaseException]],
        exc: Optional[BaseException],
        exc_tb: Optional[TracebackType],
    ) -> None:
        if exc is None:
            log.debug('Transaction exited with no exception - commiting')
            await self.commit()
            return

        log.debug('Transaction exited with exc type: %s - rolling back', exc_type)

        try:
            await self.rollback()
        except Exception as exc:
            log.warning(
                'Encountered exc `%s` while rolling back a transaction. Ignoring and raising original exception',
                exc
            )


# TODO: this should return the results as well
# TODO: don't require copy-pasting arguments between actions and batch actions
class Batch:
    user: 'UserBatchActions'
    partnerrequest: 'PartnerRequestBatchActions'
    partnership: 'PartnershipBatchActions'
    capsule: 'CapsuleBatchActions'

    def __init__(self, client: Prisma) -> None:
        self.__client = client
        self.__queries: List[str] = []
        self._active_provider = client._active_provider
        self.user = UserBatchActions(self)
        self.partnerrequest = PartnerRequestBatchActions(self)
        self.partnership = PartnershipBatchActions(self)
        self.capsule = CapsuleBatchActions(self)

    def _add(self, **kwargs: Any) -> None:
        builder = QueryBuilder(**kwargs)
        self.__queries.append(builder.build_query())

    async def commit(self) -> None:
        """Execute the queries"""
        # TODO: normalise this, we should still call client._execute
        queries = self.__queries
        self.__queries = []

        payload = {
            'batch': [
                {
                    'query': query,
                    'variables': {},
                }
                for query in queries
            ],
            'transaction': True,
        }
        await self.__client._engine.query(
            dumps(payload),
            tx_id=self.__client._tx_id,
        )

    def execute_raw(self, query: LiteralString, *args: Any) -> None:
        self._add(
            method='execute_raw',
            arguments={
                'query': query,
                'parameters': args,
            }
        )

    async def __aenter__(self) -> 'Batch':
        return self

    async def __aexit__(
        self,
        exc_type: Optional[Type[BaseException]],
        exc: Optional[BaseException],
        exc_tb: Optional[TracebackType],
    ) -> None:
        if exc is None:
            await self.commit()


# NOTE: some arguments are meaningless in this context but are included
# for completeness sake
class UserBatchActions:
    def __init__(self, batcher: Batch) -> None:
        self._batcher = batcher

    def create(
        self,
        data: types.UserCreateInput,
        include: Optional[types.UserInclude] = None
    ) -> None:
        self._batcher._add(
            method='create',
            model=models.User,
            arguments={
                'data': data,
                'include': include,
            },
        )

    def create_many(
        self,
        data: List[types.UserCreateWithoutRelationsInput],
        *,
        skip_duplicates: Optional[bool] = None,
    ) -> None:
        if self._batcher._active_provider == 'sqlite':
            raise errors.UnsupportedDatabaseError('sqlite', 'create_many()')

        self._batcher._add(
            method='create_many',
            model=models.User,
            arguments={
                'data': data,
                'skipDuplicates': skip_duplicates,
            },
            root_selection=['count'],
        )

    def delete(
        self,
        where: types.UserWhereUniqueInput,
        include: Optional[types.UserInclude] = None,
    ) -> None:
        self._batcher._add(
            method='delete',
            model=models.User,
            arguments={
                'where': where,
                'include': include,
            },
        )

    def update(
        self,
        data: types.UserUpdateInput,
        where: types.UserWhereUniqueInput,
        include: Optional[types.UserInclude] = None
    ) -> None:
        self._batcher._add(
            method='update',
            model=models.User,
            arguments={
                'data': data,
                'where': where,
                'include': include,
            },
        )

    def upsert(
        self,
        where: types.UserWhereUniqueInput,
        data: types.UserUpsertInput,
        include: Optional[types.UserInclude] = None,
    ) -> None:
        self._batcher._add(
            method='upsert',
            model=models.User,
            arguments={
                'where': where,
                'include': include,
                'create': data.get('create'),
                'update': data.get('update'),
            },
        )

    def update_many(
        self,
        data: types.UserUpdateManyMutationInput,
        where: types.UserWhereInput,
    ) -> None:
        self._batcher._add(
            method='update_many',
            model=models.User,
            arguments={'data': data, 'where': where,},
            root_selection=['count'],
        )

    def delete_many(
        self,
        where: Optional[types.UserWhereInput] = None,
    ) -> None:
        self._batcher._add(
            method='delete_many',
            model=models.User,
            arguments={'where': where},
            root_selection=['count'],
        )



# NOTE: some arguments are meaningless in this context but are included
# for completeness sake
class PartnerRequestBatchActions:
    def __init__(self, batcher: Batch) -> None:
        self._batcher = batcher

    def create(
        self,
        data: types.PartnerRequestCreateInput,
        include: Optional[types.PartnerRequestInclude] = None
    ) -> None:
        self._batcher._add(
            method='create',
            model=models.PartnerRequest,
            arguments={
                'data': data,
                'include': include,
            },
        )

    def create_many(
        self,
        data: List[types.PartnerRequestCreateWithoutRelationsInput],
        *,
        skip_duplicates: Optional[bool] = None,
    ) -> None:
        if self._batcher._active_provider == 'sqlite':
            raise errors.UnsupportedDatabaseError('sqlite', 'create_many()')

        self._batcher._add(
            method='create_many',
            model=models.PartnerRequest,
            arguments={
                'data': data,
                'skipDuplicates': skip_duplicates,
            },
            root_selection=['count'],
        )

    def delete(
        self,
        where: types.PartnerRequestWhereUniqueInput,
        include: Optional[types.PartnerRequestInclude] = None,
    ) -> None:
        self._batcher._add(
            method='delete',
            model=models.PartnerRequest,
            arguments={
                'where': where,
                'include': include,
            },
        )

    def update(
        self,
        data: types.PartnerRequestUpdateInput,
        where: types.PartnerRequestWhereUniqueInput,
        include: Optional[types.PartnerRequestInclude] = None
    ) -> None:
        self._batcher._add(
            method='update',
            model=models.PartnerRequest,
            arguments={
                'data': data,
                'where': where,
                'include': include,
            },
        )

    def upsert(
        self,
        where: types.PartnerRequestWhereUniqueInput,
        data: types.PartnerRequestUpsertInput,
        include: Optional[types.PartnerRequestInclude] = None,
    ) -> None:
        self._batcher._add(
            method='upsert',
            model=models.PartnerRequest,
            arguments={
                'where': where,
                'include': include,
                'create': data.get('create'),
                'update': data.get('update'),
            },
        )

    def update_many(
        self,
        data: types.PartnerRequestUpdateManyMutationInput,
        where: types.PartnerRequestWhereInput,
    ) -> None:
        self._batcher._add(
            method='update_many',
            model=models.PartnerRequest,
            arguments={'data': data, 'where': where,},
            root_selection=['count'],
        )

    def delete_many(
        self,
        where: Optional[types.PartnerRequestWhereInput] = None,
    ) -> None:
        self._batcher._add(
            method='delete_many',
            model=models.PartnerRequest,
            arguments={'where': where},
            root_selection=['count'],
        )



# NOTE: some arguments are meaningless in this context but are included
# for completeness sake
class PartnershipBatchActions:
    def __init__(self, batcher: Batch) -> None:
        self._batcher = batcher

    def create(
        self,
        data: types.PartnershipCreateInput,
        include: Optional[types.PartnershipInclude] = None
    ) -> None:
        self._batcher._add(
            method='create',
            model=models.Partnership,
            arguments={
                'data': data,
                'include': include,
            },
        )

    def create_many(
        self,
        data: List[types.PartnershipCreateWithoutRelationsInput],
        *,
        skip_duplicates: Optional[bool] = None,
    ) -> None:
        if self._batcher._active_provider == 'sqlite':
            raise errors.UnsupportedDatabaseError('sqlite', 'create_many()')

        self._batcher._add(
            method='create_many',
            model=models.Partnership,
            arguments={
                'data': data,
                'skipDuplicates': skip_duplicates,
            },
            root_selection=['count'],
        )

    def delete(
        self,
        where: types.PartnershipWhereUniqueInput,
        include: Optional[types.PartnershipInclude] = None,
    ) -> None:
        self._batcher._add(
            method='delete',
            model=models.Partnership,
            arguments={
                'where': where,
                'include': include,
            },
        )

    def update(
        self,
        data: types.PartnershipUpdateInput,
        where: types.PartnershipWhereUniqueInput,
        include: Optional[types.PartnershipInclude] = None
    ) -> None:
        self._batcher._add(
            method='update',
            model=models.Partnership,
            arguments={
                'data': data,
                'where': where,
                'include': include,
            },
        )

    def upsert(
        self,
        where: types.PartnershipWhereUniqueInput,
        data: types.PartnershipUpsertInput,
        include: Optional[types.PartnershipInclude] = None,
    ) -> None:
        self._batcher._add(
            method='upsert',
            model=models.Partnership,
            arguments={
                'where': where,
                'include': include,
                'create': data.get('create'),
                'update': data.get('update'),
            },
        )

    def update_many(
        self,
        data: types.PartnershipUpdateManyMutationInput,
        where: types.PartnershipWhereInput,
    ) -> None:
        self._batcher._add(
            method='update_many',
            model=models.Partnership,
            arguments={'data': data, 'where': where,},
            root_selection=['count'],
        )

    def delete_many(
        self,
        where: Optional[types.PartnershipWhereInput] = None,
    ) -> None:
        self._batcher._add(
            method='delete_many',
            model=models.Partnership,
            arguments={'where': where},
            root_selection=['count'],
        )



# NOTE: some arguments are meaningless in this context but are included
# for completeness sake
class CapsuleBatchActions:
    def __init__(self, batcher: Batch) -> None:
        self._batcher = batcher

    def create(
        self,
        data: types.CapsuleCreateInput,
        include: Optional[types.CapsuleInclude] = None
    ) -> None:
        self._batcher._add(
            method='create',
            model=models.Capsule,
            arguments={
                'data': data,
                'include': include,
            },
        )

    def create_many(
        self,
        data: List[types.CapsuleCreateWithoutRelationsInput],
        *,
        skip_duplicates: Optional[bool] = None,
    ) -> None:
        if self._batcher._active_provider == 'sqlite':
            raise errors.UnsupportedDatabaseError('sqlite', 'create_many()')

        self._batcher._add(
            method='create_many',
            model=models.Capsule,
            arguments={
                'data': data,
                'skipDuplicates': skip_duplicates,
            },
            root_selection=['count'],
        )

    def delete(
        self,
        where: types.CapsuleWhereUniqueInput,
        include: Optional[types.CapsuleInclude] = None,
    ) -> None:
        self._batcher._add(
            method='delete',
            model=models.Capsule,
            arguments={
                'where': where,
                'include': include,
            },
        )

    def update(
        self,
        data: types.CapsuleUpdateInput,
        where: types.CapsuleWhereUniqueInput,
        include: Optional[types.CapsuleInclude] = None
    ) -> None:
        self._batcher._add(
            method='update',
            model=models.Capsule,
            arguments={
                'data': data,
                'where': where,
                'include': include,
            },
        )

    def upsert(
        self,
        where: types.CapsuleWhereUniqueInput,
        data: types.CapsuleUpsertInput,
        include: Optional[types.CapsuleInclude] = None,
    ) -> None:
        self._batcher._add(
            method='upsert',
            model=models.Capsule,
            arguments={
                'where': where,
                'include': include,
                'create': data.get('create'),
                'update': data.get('update'),
            },
        )

    def update_many(
        self,
        data: types.CapsuleUpdateManyMutationInput,
        where: types.CapsuleWhereInput,
    ) -> None:
        self._batcher._add(
            method='update_many',
            model=models.Capsule,
            arguments={'data': data, 'where': where,},
            root_selection=['count'],
        )

    def delete_many(
        self,
        where: Optional[types.CapsuleWhereInput] = None,
    ) -> None:
        self._batcher._add(
            method='delete_many',
            model=models.Capsule,
            arguments={'where': where},
            root_selection=['count'],
        )



Client = Prisma