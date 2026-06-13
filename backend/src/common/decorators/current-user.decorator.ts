import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type AuthenticatedUser = {
  sub: number
  login: string
  role: 'ADMIN' | 'USUARIO'
  name: string
}

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>()
  return request.user
})