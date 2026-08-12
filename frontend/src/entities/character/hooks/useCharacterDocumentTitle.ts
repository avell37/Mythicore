'use client';

import { useEffect } from 'react';
import { buildCharacterDocumentTitle } from '../lib/format';
import type { Character } from '../model/Character';

export const useCharacterDocumentTitle = (character?: Character) => {
	useEffect(() => {
		if (!character) return;
		document.title = buildCharacterDocumentTitle(character);
	}, [character]);
};
