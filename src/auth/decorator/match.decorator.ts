import {
    registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} must match ${validationArguments.constraints[0]}`;
  }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: MatchConstraint,
      });
    };
  }
