import { chance } from 'jest-chance';
import {
  deserialize,
  isClass,
  serializeObj as serialize
} from '../src/serialize';
import validate, {
  StringType,
  Branch,
  FunctionType
} from '@nonamenpm/type-validate';

/**
 *
 */
class TestClass {
  public test = 'string';
  /**
   * Test fn
   */
  public fn(arg: any) {
    return arg;
  }

  public nestedClass = new (class {
    public test2 = '';
  })();
}

describe('serialize.ts', () => {
  const serialized = serialize(new TestClass());
  describe('serialize()', () => {
    it('should return the class as string', () => {
      expect(serialized).toBe(
        '{"test":"string","nestedClass":{"test2":""},"fn":function (arg) {    return arg;  }}'
      );
    });
  });

  describe('deserialize()', () => {
    /* eslint new-cap: */
    it('should return an object', () => {
      const rule = {
        test: StringType,
        nestedClass: Branch({ test2: StringType }),
        fn: FunctionType
      };

      expect(() =>
        validate(rule, deserialize(serialized) as Record<string, unknown>)
      ).not.toThrow();
    });
  });

  describe('isClass()', () => {
    it('should return true for classes', () => {
      const instance = new TestClass();
      expect(isClass(instance)).toBe(true);
    });
    it('should return false for functions', () => {
      const fn = () => {};
      expect(isClass(fn)).toBe(false);
    });
    it('should return false for primitives', () => {
      expect(isClass(chance.d100())).toBe(false);
      expect(isClass(chance.string())).toBe(false);
      expect(isClass(chance.falsy())).toBe(false);
      expect(isClass(!chance.falsy())).toBe(false);
    });
  });
});
