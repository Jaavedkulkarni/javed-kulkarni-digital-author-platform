import type { SystemRole } from '../../types/roles';
import { ROLE_REGISTRY_LIST, ROLE_REGISTRY_MAP } from '../registry/role.registry';
import { collectInheritedRoles } from './role-resolver.service';
import type {
  RoleAssignmentValidationInput,
  RoleValidationResult,
} from '../types/role-registry.types';

function fail(errors: string[]): RoleValidationResult {
  return { valid: false, errors };
}

function ok(): RoleValidationResult {
  return { valid: true, errors: [] };
}

/** Validates roles against the immutable registry and locked inheritance rules. */
export class RoleValidator {
  validateRole(role: SystemRole): RoleValidationResult {
    const definition = ROLE_REGISTRY_MAP[role];
    if (!definition) {
      return fail([`Unknown role: ${role}`]);
    }
    if (!definition.isActive) {
      return fail([`Role "${definition.name}" is inactive.`]);
    }
    return ok();
  }

  validateInheritance(role: SystemRole): RoleValidationResult {
    const roleValidation = this.validateRole(role);
    if (!roleValidation.valid) return roleValidation;

    const definition = ROLE_REGISTRY_MAP[role];
    const errors: string[] = [];

    for (const inherited of definition.inherits) {
      const inheritedValidation = this.validateRole(inherited);
      if (!inheritedValidation.valid) {
        errors.push(...inheritedValidation.errors);
        continue;
      }

      const circular = this.preventCircularInheritance(role, inherited);
      if (!circular.valid) {
        errors.push(...circular.errors);
      }
    }

    if (role === 'publisher' && definition.inherits.length > 0) {
      errors.push('Publisher must remain an independent role and cannot inherit other roles.');
    }

    return errors.length > 0 ? fail(errors) : ok();
  }

  preventCircularInheritance(role: SystemRole, target?: SystemRole): RoleValidationResult {
    const errors: string[] = [];

    const detectCycle = (current: SystemRole, ancestry: Set<SystemRole>): boolean => {
      if (ancestry.has(current)) return true;
      const nextAncestry = new Set(ancestry);
      nextAncestry.add(current);
      const definition = ROLE_REGISTRY_MAP[current];
      if (!definition) return false;
      return definition.inherits.some((parent) => detectCycle(parent, nextAncestry));
    };

    for (const definition of ROLE_REGISTRY_LIST) {
      if (detectCycle(definition.id, new Set())) {
        errors.push(`Circular inheritance detected involving "${definition.id}".`);
      }
    }

    if (target) {
      const simulated = collectInheritedRoles(role);
      if (simulated.includes(target) && role !== target) {
        errors.push(`Role "${role}" cannot inherit from "${target}" without creating a cycle.`);
      }
    }

    return errors.length > 0 ? fail(errors) : ok();
  }

  validateAssignment(input: RoleAssignmentValidationInput): RoleValidationResult {
    const { currentRoles, role } = input;
    const errors: string[] = [];

    const roleValidation = this.validateRole(role);
    if (!roleValidation.valid) return roleValidation;

    const definition = ROLE_REGISTRY_MAP[role];
    if (!definition.isAssignable) {
      errors.push(`Role "${definition.name}" cannot be assigned manually.`);
    }

    if (currentRoles.includes(role)) {
      errors.push(`Role "${definition.name}" is already assigned.`);
    }

    const inheritanceValidation = this.validateInheritance(role);
    if (!inheritanceValidation.valid) {
      errors.push(...inheritanceValidation.errors);
    }

    if (role === 'publisher' && currentRoles.some((assigned) => assigned !== 'publisher')) {
      errors.push('Publisher is an independent role and should not be combined with other roles.');
    }

    if (currentRoles.includes('publisher') && role !== 'publisher') {
      errors.push('Users with the Publisher role cannot receive additional roles.');
    }

    return errors.length > 0 ? fail(errors) : ok();
  }

  validateRegistry(): RoleValidationResult {
    const errors: string[] = [];

    for (const definition of ROLE_REGISTRY_LIST) {
      const roleValidation = this.validateRole(definition.id);
      if (!roleValidation.valid) errors.push(...roleValidation.errors);

      const inheritanceValidation = this.validateInheritance(definition.id);
      if (!inheritanceValidation.valid) errors.push(...inheritanceValidation.errors);
    }

    const circularValidation = this.preventCircularInheritance('reader');
    if (!circularValidation.valid) errors.push(...circularValidation.errors);

    return errors.length > 0 ? fail(errors) : ok();
  }
}

export const roleValidator = new RoleValidator();

export function createRoleValidator(): RoleValidator {
  return roleValidator;
}
