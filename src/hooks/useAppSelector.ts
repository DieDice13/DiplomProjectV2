﻿// src/hooks/useAppSelector.ts
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../app/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
