import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { FetchTimeoutError } from 'src/shared/utils/fetch-with-timeout';

@Catch(FetchTimeoutError)
export class FetchTimeoutFilter implements ExceptionFilter {
	private readonly logger = new Logger(FetchTimeoutFilter.name);

	catch(exception: FetchTimeoutError, host: ArgumentsHost) {
		this.logger.error(exception.message);

		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		response.status(HttpStatus.BAD_GATEWAY).json({
			status: HttpStatus.BAD_GATEWAY,
			message: 'Character data is temporarily unavailable. Try again later.',
		});
	}
}
