import { interfaces } from 'inversify';
import _ from 'lodash';
import getDecorators from 'inversify-inject-decorators';
import { componentContainer, componentMetaKey } from '../lib';
import BindingScope = interfaces.BindingScope;

const { lazyInject } = getDecorators(componentContainer);

/**
 * 组件定义装饰器
 * @param identifier
 * @param scope
 */
export function provideComponent<T extends Constructor>(
    identifier?: string | symbol,
    scope?: BindingScope
) {
    return (constructor: T) => {
        let id = identifier,
            name = _.toString(identifier);
        if (!id) {
            id = _.camelCase(constructor.name);
            name = _.chain(id)
                .replace(/component/i, '')
                .snakeCase()
                .valueOf();
        }
        constructor.prototype._name = name;
        Reflect.defineMetadata(componentMetaKey, {
            id,
            originName: constructor.name,
            scope
        }, constructor);
    };
}

/**
 * 组件对象引用注入装饰器
 * @param identifier
 */
export function injectComponent(identifier?: string | symbol) {
    return function (target: any, key: string) {
        let id = identifier;
        if (!id) {
            id = _.camelCase(key);
        }
        return lazyInject(id)(target, key);
    };
}
