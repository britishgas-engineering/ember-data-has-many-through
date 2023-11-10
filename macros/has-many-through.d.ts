import ArrayProxy from '@ember/array/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
/**
  @method hasManyThrough
  @param hasMany child
  @param hasMany childOfChild
*/
export default function (...args: any[]): import("@ember/object/computed").default<PromiseProxyMixin<any> & {
    meta: import("@ember/object/computed").default<unknown, unknown>;
} & ArrayProxy<unknown> & {
    promise: any;
}, PromiseProxyMixin<any> & {
    meta: import("@ember/object/computed").default<unknown, unknown>;
} & ArrayProxy<unknown> & {
    promise: any;
}>;
//# sourceMappingURL=has-many-through.d.ts.map