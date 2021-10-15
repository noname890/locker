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

    it('should be able to call class members', () => {
      /* eslint require-jsdoc: */
      class TestClass {
        public test1() {
          return 1 + this.test2();
        }
        public test2() {
          return 1;
        }
      }

      const serialized = serialize({
        testClass: new TestClass()
      });
      const deserialized = deserialize(serialized) as Record<string, any>;

      expect(deserialized.testClass.test1()).toBe(2);
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
