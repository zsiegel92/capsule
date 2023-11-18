'use server';
import { revalidatePath } from 'next/cache';

import { User, PartnerRequest } from '@prisma/client';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { UserWithPartnership } from '@/lib/types';
import { getPartnerFromUser } from '@/lib/db_utils';
import { getUserWithPartnershipByEmail } from '@/lib/capsuleRelatedServerActions';
