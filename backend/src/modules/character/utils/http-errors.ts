import { HttpException, HttpStatus } from '@nestjs/common';

const mapErrorStatus = (status: number): number => {
	if (status === 404 || status === 403) return HttpStatus.NOT_FOUND;
	if (status === 429) return HttpStatus.TOO_MANY_REQUESTS;
	if (status === 401) return HttpStatus.BAD_GATEWAY;
	if (status >= 500) return HttpStatus.BAD_GATEWAY;
	return HttpStatus.BAD_GATEWAY;
};

export const throwBlizzardError = async (response: Response, what: string): Promise<never> => {
	const text = await response.text();
	const status = mapErrorStatus(response.status);

	throw new HttpException(
		{
			status,
			message: `Blizzard ${what} failed. Status: ${response.status}. Error: ${text}`,
		},
		status,
	);
};

export const throwRaiderError = async (response: Response, what: string): Promise<never> => {
	const text = await response.text();
	const status = mapErrorStatus(response.status);

	throw new HttpException(
		{
			status,
			message: `Raider ${what} failed. Status: ${response.status}. Error: ${text}`,
		},
		status,
	);
};
