import { HttpException, HttpStatus, Logger } from '@nestjs/common';

const logger = new Logger('Upstream');

type UpstreamSource = 'Blizzard' | 'Raider';

const mapUpstreamStatus = (status: number): number => {
	if (status === 404) return HttpStatus.NOT_FOUND;
	if (status === 429) return HttpStatus.TOO_MANY_REQUESTS;
	return HttpStatus.BAD_GATEWAY;
};

const clientMessage = (apiStatus: number): string => {
	if (apiStatus === HttpStatus.NOT_FOUND) {
		return 'Character not found.';
	}
	if (apiStatus === HttpStatus.TOO_MANY_REQUESTS) {
		return 'Too many requests. Try again later.';
	}
	return 'Character data is temporarily unavailable. Try again later.';
};

const throwUpstreamError = async (
	response: Response,
	source: UpstreamSource,
	what: string,
): Promise<never> => {
	const body = await response.text();
	const upstreamStatus = response.status;
	const apiStatus = mapUpstreamStatus(upstreamStatus);

	logger.error(
		`${source} ${what} failed: upstream=${upstreamStatus} mapped=${apiStatus} body=${body.slice(0, 500)}`,
	);

	throw new HttpException(
		{
			status: apiStatus,
			message: clientMessage(apiStatus),
		},
		apiStatus,
	);
};

export const throwBlizzardError = (response: Response, what: string) =>
	throwUpstreamError(response, 'Blizzard', what);

export const throwRaiderError = (response: Response, what: string) =>
	throwUpstreamError(response, 'Raider', what);
