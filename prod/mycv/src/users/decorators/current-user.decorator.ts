import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    //context = incoming request Wrapper
    (data: any,context:ExecutionContext)=>{
        const  request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)