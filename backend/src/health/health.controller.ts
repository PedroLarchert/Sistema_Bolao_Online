import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'API status response' })
  status() {
    return {
      status: 'ok',
      service: 'bola-api',
      timestamp: new Date().toISOString(),
    }
  }
}