import EventEmitter from 'events';//引入在 tsconfig.json 文件中设置这个选项： "compilerOptions": {"allowSyntheticDefaultImports": true,}

export const  myEmitter = new EventEmitter();