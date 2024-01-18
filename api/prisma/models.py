# -*- coding: utf-8 -*-
# code generated by Prisma. DO NOT EDIT.
# pyright: reportUnusedImport=false
# fmt: off

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
# -- template models.py.jinja --
import os
import logging
import inspect
import warnings
from collections import OrderedDict

from pydantic import BaseModel, Field

from . import types, enums, errors, fields, bases
from ._types import FuncType
from ._compat import model_rebuild, field_validator
from .builder import serialize_base64
from .generator import partial_models_ctx, PartialModelField


log: logging.Logger = logging.getLogger(__name__)
_created_partial_types: Set[str] = set()

class User(bases.BaseUser):
    """Represents a User record"""

    id: _int
    email: _str
    password: _str
    firstName: _str
    partnershipId: Optional[_int] = None
    authoredCapsules: Optional[List['models.Capsule']] = None
    partnerRequests: Optional[List['models.PartnerRequest']] = None
    partnership: Optional['models.Partnership'] = None
    openedCapsules: Optional[List['models.Capsule']] = None

    # take *args and **kwargs so that other metaclasses can define arguments
    def __init_subclass__(
        cls,
        *args: Any,
        warn_subclass: Optional[bool] = None,
        **kwargs: Any,
    ) -> None:
        super().__init_subclass__()
        if warn_subclass is not None:
            warnings.warn(
                'The `warn_subclass` argument is deprecated as it is no longer necessary and will be removed in the next release',
                DeprecationWarning,
                stacklevel=3,
            )


    @staticmethod
    def create_partial(
        name: str,
        include: Optional[Iterable['types.UserKeys']] = None,
        exclude: Optional[Iterable['types.UserKeys']] = None,
        required: Optional[Iterable['types.UserKeys']] = None,
        optional: Optional[Iterable['types.UserKeys']] = None,
        relations: Optional[Mapping['types.UserRelationalFieldKeys', str]] = None,
        exclude_relational_fields: bool = False,
    ) -> None:
        if not os.environ.get('PRISMA_GENERATOR_INVOCATION'):
            raise RuntimeError(
                'Attempted to create a partial type outside of client generation.'
            )

        if name in _created_partial_types:
            raise ValueError(f'Partial type "{name}" has already been created.')

        if include is not None:
            if exclude is not None:
                raise TypeError('Exclude and include are mutually exclusive.')
            if exclude_relational_fields is True:
                raise TypeError('Include and exclude_relational_fields=True are mutually exclusive.')

        if required and optional:
            shared = set(required) & set(optional)
            if shared:
                raise ValueError(f'Cannot make the same field(s) required and optional {shared}')

        if exclude_relational_fields and relations:
            raise ValueError(
                'exclude_relational_fields and relations are mutually exclusive'
            )

        fields: Dict['types.UserKeys', PartialModelField] = OrderedDict()

        try:
            if include:
                for field in include:
                    fields[field] = _User_fields[field].copy()
            elif exclude:
                for field in exclude:
                    if field not in _User_fields:
                        raise KeyError(field)

                fields = {
                    key: data.copy()
                    for key, data in _User_fields.items()
                    if key not in exclude
                }
            else:
                fields = {
                    key: data.copy()
                    for key, data in _User_fields.items()
                }

            if required:
                for field in required:
                    fields[field]['optional'] = False

            if optional:
                for field in optional:
                    fields[field]['optional'] = True

            if exclude_relational_fields:
                fields = {
                    key: data
                    for key, data in fields.items()
                    if key not in _User_relational_fields
                }

            if relations:
                for field, type_ in relations.items():
                    if field not in _User_relational_fields:
                        raise errors.UnknownRelationalFieldError('User', field)

                    # TODO: this method of validating types is not ideal
                    # as it means we cannot two create partial types that
                    # reference each other
                    if type_ not in _created_partial_types:
                        raise ValueError(
                            f'Unknown partial type: "{type_}". '
                            f'Did you remember to generate the {type_} type before this one?'
                        )

                    # TODO: support non prisma.partials models
                    info = fields[field]
                    if info['is_list']:
                        info['type'] = f'List[\'partials.{type_}\']'
                    else:
                        info['type'] = f'\'partials.{type_}\''
        except KeyError as exc:
            raise ValueError(
                f'{exc.args[0]} is not a valid User / {name} field.'
            ) from None

        models = partial_models_ctx.get()
        models.append(
            {
                'name': name,
                'fields': cast(Mapping[str, PartialModelField], fields),
                'from_model': 'User',
            }
        )
        _created_partial_types.add(name)


class PartnerRequest(bases.BasePartnerRequest):
    """Represents a PartnerRequest record"""

    id: _int
    toEmail: _str
    fromId: _int
    createdAt: datetime.datetime
    fromUser: Optional['models.User'] = None

    # take *args and **kwargs so that other metaclasses can define arguments
    def __init_subclass__(
        cls,
        *args: Any,
        warn_subclass: Optional[bool] = None,
        **kwargs: Any,
    ) -> None:
        super().__init_subclass__()
        if warn_subclass is not None:
            warnings.warn(
                'The `warn_subclass` argument is deprecated as it is no longer necessary and will be removed in the next release',
                DeprecationWarning,
                stacklevel=3,
            )


    @staticmethod
    def create_partial(
        name: str,
        include: Optional[Iterable['types.PartnerRequestKeys']] = None,
        exclude: Optional[Iterable['types.PartnerRequestKeys']] = None,
        required: Optional[Iterable['types.PartnerRequestKeys']] = None,
        optional: Optional[Iterable['types.PartnerRequestKeys']] = None,
        relations: Optional[Mapping['types.PartnerRequestRelationalFieldKeys', str]] = None,
        exclude_relational_fields: bool = False,
    ) -> None:
        if not os.environ.get('PRISMA_GENERATOR_INVOCATION'):
            raise RuntimeError(
                'Attempted to create a partial type outside of client generation.'
            )

        if name in _created_partial_types:
            raise ValueError(f'Partial type "{name}" has already been created.')

        if include is not None:
            if exclude is not None:
                raise TypeError('Exclude and include are mutually exclusive.')
            if exclude_relational_fields is True:
                raise TypeError('Include and exclude_relational_fields=True are mutually exclusive.')

        if required and optional:
            shared = set(required) & set(optional)
            if shared:
                raise ValueError(f'Cannot make the same field(s) required and optional {shared}')

        if exclude_relational_fields and relations:
            raise ValueError(
                'exclude_relational_fields and relations are mutually exclusive'
            )

        fields: Dict['types.PartnerRequestKeys', PartialModelField] = OrderedDict()

        try:
            if include:
                for field in include:
                    fields[field] = _PartnerRequest_fields[field].copy()
            elif exclude:
                for field in exclude:
                    if field not in _PartnerRequest_fields:
                        raise KeyError(field)

                fields = {
                    key: data.copy()
                    for key, data in _PartnerRequest_fields.items()
                    if key not in exclude
                }
            else:
                fields = {
                    key: data.copy()
                    for key, data in _PartnerRequest_fields.items()
                }

            if required:
                for field in required:
                    fields[field]['optional'] = False

            if optional:
                for field in optional:
                    fields[field]['optional'] = True

            if exclude_relational_fields:
                fields = {
                    key: data
                    for key, data in fields.items()
                    if key not in _PartnerRequest_relational_fields
                }

            if relations:
                for field, type_ in relations.items():
                    if field not in _PartnerRequest_relational_fields:
                        raise errors.UnknownRelationalFieldError('PartnerRequest', field)

                    # TODO: this method of validating types is not ideal
                    # as it means we cannot two create partial types that
                    # reference each other
                    if type_ not in _created_partial_types:
                        raise ValueError(
                            f'Unknown partial type: "{type_}". '
                            f'Did you remember to generate the {type_} type before this one?'
                        )

                    # TODO: support non prisma.partials models
                    info = fields[field]
                    if info['is_list']:
                        info['type'] = f'List[\'partials.{type_}\']'
                    else:
                        info['type'] = f'\'partials.{type_}\''
        except KeyError as exc:
            raise ValueError(
                f'{exc.args[0]} is not a valid PartnerRequest / {name} field.'
            ) from None

        models = partial_models_ctx.get()
        models.append(
            {
                'name': name,
                'fields': cast(Mapping[str, PartialModelField], fields),
                'from_model': 'PartnerRequest',
            }
        )
        _created_partial_types.add(name)


class Partnership(bases.BasePartnership):
    """Represents a Partnership record"""

    id: _int
    createdAt: datetime.datetime
    capsules: Optional[List['models.Capsule']] = None
    partners: Optional[List['models.User']] = None

    # take *args and **kwargs so that other metaclasses can define arguments
    def __init_subclass__(
        cls,
        *args: Any,
        warn_subclass: Optional[bool] = None,
        **kwargs: Any,
    ) -> None:
        super().__init_subclass__()
        if warn_subclass is not None:
            warnings.warn(
                'The `warn_subclass` argument is deprecated as it is no longer necessary and will be removed in the next release',
                DeprecationWarning,
                stacklevel=3,
            )


    @staticmethod
    def create_partial(
        name: str,
        include: Optional[Iterable['types.PartnershipKeys']] = None,
        exclude: Optional[Iterable['types.PartnershipKeys']] = None,
        required: Optional[Iterable['types.PartnershipKeys']] = None,
        optional: Optional[Iterable['types.PartnershipKeys']] = None,
        relations: Optional[Mapping['types.PartnershipRelationalFieldKeys', str]] = None,
        exclude_relational_fields: bool = False,
    ) -> None:
        if not os.environ.get('PRISMA_GENERATOR_INVOCATION'):
            raise RuntimeError(
                'Attempted to create a partial type outside of client generation.'
            )

        if name in _created_partial_types:
            raise ValueError(f'Partial type "{name}" has already been created.')

        if include is not None:
            if exclude is not None:
                raise TypeError('Exclude and include are mutually exclusive.')
            if exclude_relational_fields is True:
                raise TypeError('Include and exclude_relational_fields=True are mutually exclusive.')

        if required and optional:
            shared = set(required) & set(optional)
            if shared:
                raise ValueError(f'Cannot make the same field(s) required and optional {shared}')

        if exclude_relational_fields and relations:
            raise ValueError(
                'exclude_relational_fields and relations are mutually exclusive'
            )

        fields: Dict['types.PartnershipKeys', PartialModelField] = OrderedDict()

        try:
            if include:
                for field in include:
                    fields[field] = _Partnership_fields[field].copy()
            elif exclude:
                for field in exclude:
                    if field not in _Partnership_fields:
                        raise KeyError(field)

                fields = {
                    key: data.copy()
                    for key, data in _Partnership_fields.items()
                    if key not in exclude
                }
            else:
                fields = {
                    key: data.copy()
                    for key, data in _Partnership_fields.items()
                }

            if required:
                for field in required:
                    fields[field]['optional'] = False

            if optional:
                for field in optional:
                    fields[field]['optional'] = True

            if exclude_relational_fields:
                fields = {
                    key: data
                    for key, data in fields.items()
                    if key not in _Partnership_relational_fields
                }

            if relations:
                for field, type_ in relations.items():
                    if field not in _Partnership_relational_fields:
                        raise errors.UnknownRelationalFieldError('Partnership', field)

                    # TODO: this method of validating types is not ideal
                    # as it means we cannot two create partial types that
                    # reference each other
                    if type_ not in _created_partial_types:
                        raise ValueError(
                            f'Unknown partial type: "{type_}". '
                            f'Did you remember to generate the {type_} type before this one?'
                        )

                    # TODO: support non prisma.partials models
                    info = fields[field]
                    if info['is_list']:
                        info['type'] = f'List[\'partials.{type_}\']'
                    else:
                        info['type'] = f'\'partials.{type_}\''
        except KeyError as exc:
            raise ValueError(
                f'{exc.args[0]} is not a valid Partnership / {name} field.'
            ) from None

        models = partial_models_ctx.get()
        models.append(
            {
                'name': name,
                'fields': cast(Mapping[str, PartialModelField], fields),
                'from_model': 'Partnership',
            }
        )
        _created_partial_types.add(name)


class Capsule(bases.BaseCapsule):
    """Represents a Capsule record"""

    id: _int
    createdAt: datetime.datetime
    open: _bool
    openedBy: Optional['models.User'] = None
    openedById: Optional[_int] = None
    color: _str
    message: _str
    authorId: _int
    partnershipId: Optional[_int] = None
    lastOpened: Optional[datetime.datetime] = None
    nTimesOpened: _int
    author: Optional['models.User'] = None
    partnership: Optional['models.Partnership'] = None

    # take *args and **kwargs so that other metaclasses can define arguments
    def __init_subclass__(
        cls,
        *args: Any,
        warn_subclass: Optional[bool] = None,
        **kwargs: Any,
    ) -> None:
        super().__init_subclass__()
        if warn_subclass is not None:
            warnings.warn(
                'The `warn_subclass` argument is deprecated as it is no longer necessary and will be removed in the next release',
                DeprecationWarning,
                stacklevel=3,
            )


    @staticmethod
    def create_partial(
        name: str,
        include: Optional[Iterable['types.CapsuleKeys']] = None,
        exclude: Optional[Iterable['types.CapsuleKeys']] = None,
        required: Optional[Iterable['types.CapsuleKeys']] = None,
        optional: Optional[Iterable['types.CapsuleKeys']] = None,
        relations: Optional[Mapping['types.CapsuleRelationalFieldKeys', str]] = None,
        exclude_relational_fields: bool = False,
    ) -> None:
        if not os.environ.get('PRISMA_GENERATOR_INVOCATION'):
            raise RuntimeError(
                'Attempted to create a partial type outside of client generation.'
            )

        if name in _created_partial_types:
            raise ValueError(f'Partial type "{name}" has already been created.')

        if include is not None:
            if exclude is not None:
                raise TypeError('Exclude and include are mutually exclusive.')
            if exclude_relational_fields is True:
                raise TypeError('Include and exclude_relational_fields=True are mutually exclusive.')

        if required and optional:
            shared = set(required) & set(optional)
            if shared:
                raise ValueError(f'Cannot make the same field(s) required and optional {shared}')

        if exclude_relational_fields and relations:
            raise ValueError(
                'exclude_relational_fields and relations are mutually exclusive'
            )

        fields: Dict['types.CapsuleKeys', PartialModelField] = OrderedDict()

        try:
            if include:
                for field in include:
                    fields[field] = _Capsule_fields[field].copy()
            elif exclude:
                for field in exclude:
                    if field not in _Capsule_fields:
                        raise KeyError(field)

                fields = {
                    key: data.copy()
                    for key, data in _Capsule_fields.items()
                    if key not in exclude
                }
            else:
                fields = {
                    key: data.copy()
                    for key, data in _Capsule_fields.items()
                }

            if required:
                for field in required:
                    fields[field]['optional'] = False

            if optional:
                for field in optional:
                    fields[field]['optional'] = True

            if exclude_relational_fields:
                fields = {
                    key: data
                    for key, data in fields.items()
                    if key not in _Capsule_relational_fields
                }

            if relations:
                for field, type_ in relations.items():
                    if field not in _Capsule_relational_fields:
                        raise errors.UnknownRelationalFieldError('Capsule', field)

                    # TODO: this method of validating types is not ideal
                    # as it means we cannot two create partial types that
                    # reference each other
                    if type_ not in _created_partial_types:
                        raise ValueError(
                            f'Unknown partial type: "{type_}". '
                            f'Did you remember to generate the {type_} type before this one?'
                        )

                    # TODO: support non prisma.partials models
                    info = fields[field]
                    if info['is_list']:
                        info['type'] = f'List[\'partials.{type_}\']'
                    else:
                        info['type'] = f'\'partials.{type_}\''
        except KeyError as exc:
            raise ValueError(
                f'{exc.args[0]} is not a valid Capsule / {name} field.'
            ) from None

        models = partial_models_ctx.get()
        models.append(
            {
                'name': name,
                'fields': cast(Mapping[str, PartialModelField], fields),
                'from_model': 'Capsule',
            }
        )
        _created_partial_types.add(name)



_User_relational_fields: Set[str] = {
        'authoredCapsules',
        'partnerRequests',
        'partnership',
        'openedCapsules',
    }
_User_fields: Dict['types.UserKeys', PartialModelField] = OrderedDict(
    [
        ('id', {
            'name': 'id',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('email', {
            'name': 'email',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('password', {
            'name': 'password',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('firstName', {
            'name': 'firstName',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('partnershipId', {
            'name': 'partnershipId',
            'is_list': False,
            'optional': True,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('authoredCapsules', {
            'name': 'authoredCapsules',
            'is_list': True,
            'optional': True,
            'type': 'List[\'models.Capsule\']',
            'is_relational': True,
            'documentation': None,
        }),
        ('partnerRequests', {
            'name': 'partnerRequests',
            'is_list': True,
            'optional': True,
            'type': 'List[\'models.PartnerRequest\']',
            'is_relational': True,
            'documentation': None,
        }),
        ('partnership', {
            'name': 'partnership',
            'is_list': False,
            'optional': True,
            'type': 'models.Partnership',
            'is_relational': True,
            'documentation': None,
        }),
        ('openedCapsules', {
            'name': 'openedCapsules',
            'is_list': True,
            'optional': True,
            'type': 'List[\'models.Capsule\']',
            'is_relational': True,
            'documentation': None,
        }),
    ],
)

_PartnerRequest_relational_fields: Set[str] = {
        'fromUser',
    }
_PartnerRequest_fields: Dict['types.PartnerRequestKeys', PartialModelField] = OrderedDict(
    [
        ('id', {
            'name': 'id',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('toEmail', {
            'name': 'toEmail',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('fromId', {
            'name': 'fromId',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('createdAt', {
            'name': 'createdAt',
            'is_list': False,
            'optional': False,
            'type': 'datetime.datetime',
            'is_relational': False,
            'documentation': None,
        }),
        ('fromUser', {
            'name': 'fromUser',
            'is_list': False,
            'optional': True,
            'type': 'models.User',
            'is_relational': True,
            'documentation': None,
        }),
    ],
)

_Partnership_relational_fields: Set[str] = {
        'capsules',
        'partners',
    }
_Partnership_fields: Dict['types.PartnershipKeys', PartialModelField] = OrderedDict(
    [
        ('id', {
            'name': 'id',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('createdAt', {
            'name': 'createdAt',
            'is_list': False,
            'optional': False,
            'type': 'datetime.datetime',
            'is_relational': False,
            'documentation': None,
        }),
        ('capsules', {
            'name': 'capsules',
            'is_list': True,
            'optional': True,
            'type': 'List[\'models.Capsule\']',
            'is_relational': True,
            'documentation': None,
        }),
        ('partners', {
            'name': 'partners',
            'is_list': True,
            'optional': True,
            'type': 'List[\'models.User\']',
            'is_relational': True,
            'documentation': None,
        }),
    ],
)

_Capsule_relational_fields: Set[str] = {
        'openedBy',
        'author',
        'partnership',
    }
_Capsule_fields: Dict['types.CapsuleKeys', PartialModelField] = OrderedDict(
    [
        ('id', {
            'name': 'id',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('createdAt', {
            'name': 'createdAt',
            'is_list': False,
            'optional': False,
            'type': 'datetime.datetime',
            'is_relational': False,
            'documentation': None,
        }),
        ('open', {
            'name': 'open',
            'is_list': False,
            'optional': False,
            'type': '_bool',
            'is_relational': False,
            'documentation': None,
        }),
        ('openedBy', {
            'name': 'openedBy',
            'is_list': False,
            'optional': True,
            'type': 'models.User',
            'is_relational': True,
            'documentation': None,
        }),
        ('openedById', {
            'name': 'openedById',
            'is_list': False,
            'optional': True,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('color', {
            'name': 'color',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('message', {
            'name': 'message',
            'is_list': False,
            'optional': False,
            'type': '_str',
            'is_relational': False,
            'documentation': None,
        }),
        ('authorId', {
            'name': 'authorId',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('partnershipId', {
            'name': 'partnershipId',
            'is_list': False,
            'optional': True,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('lastOpened', {
            'name': 'lastOpened',
            'is_list': False,
            'optional': True,
            'type': 'datetime.datetime',
            'is_relational': False,
            'documentation': None,
        }),
        ('nTimesOpened', {
            'name': 'nTimesOpened',
            'is_list': False,
            'optional': False,
            'type': '_int',
            'is_relational': False,
            'documentation': None,
        }),
        ('author', {
            'name': 'author',
            'is_list': False,
            'optional': True,
            'type': 'models.User',
            'is_relational': True,
            'documentation': None,
        }),
        ('partnership', {
            'name': 'partnership',
            'is_list': False,
            'optional': True,
            'type': 'models.Partnership',
            'is_relational': True,
            'documentation': None,
        }),
    ],
)



# we have to import ourselves as relation types are namespaced to models
# e.g. models.Post
from . import models, actions

# required to support relationships between models
model_rebuild(User)
model_rebuild(PartnerRequest)
model_rebuild(Partnership)
model_rebuild(Capsule)