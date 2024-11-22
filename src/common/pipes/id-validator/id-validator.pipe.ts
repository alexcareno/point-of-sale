import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class IdValidatorPipe extends ParseIntPipe {
    constructor() {
      super({
        exceptionFactory: () => {
          return new BadRequestException('ID no válido');
        },
      })
    }
}
