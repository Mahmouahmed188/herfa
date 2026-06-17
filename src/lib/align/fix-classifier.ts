import { Mismatch, FixClassification, FixAction } from '../../types/alignment';

export function classifyMismatch(mismatch: Mismatch): FixClassification {
  const safeTypes = ['wrong_path', 'wrong_method', 'missing_auth', 'dto_field_mismatch'];
  const needsStructuralChange = mismatch.type === 'wrong_payload' || mismatch.type === 'wrong_response';
  const needsNewModule = mismatch.requiresNewFeatureModule;

  if (needsNewModule) return 'requires_manual_intervention';

  if (safeTypes.includes(mismatch.type)) {
    if (mismatch.severity === 'critical' || mismatch.severity === 'high') {
      return 'safe';
    }
    return 'safe';
  }

  if (needsStructuralChange) return 'requires_manual_intervention';

  if (mismatch.type === 'mock_data' || mismatch.type === 'deprecated_api') {
    return 'requires_manual_intervention';
  }

  return 'requires_manual_intervention';
}

export function generateFixAction(mismatch: Mismatch, oldValue: string, newValue: string): FixAction {
  return {
    mismatchId: mismatch.id,
    operation: mapMismatchTypeToFixOperation(mismatch.type),
    filePath: mismatch.fixFile,
    oldValue,
    newValue,
    confidence: classifyMismatch(mismatch) === 'safe' ? 'high' : 'medium',
    applied: false,
    verified: false,
  };
}

function mapMismatchTypeToFixOperation(type: string): FixAction['operation'] {
  const mapping: Record<string, FixAction['operation']> = {
    wrong_path: 'replace_path',
    wrong_method: 'replace_method',
    missing_auth: 'update_auth_source',
    dto_field_mismatch: 'rename_field',
    wrong_payload: 'replace_client',
    wrong_response: 'wrap_response',
    mock_data: 'replace_client',
    deprecated_api: 'replace_path',
  };
  return mapping[type] || 'replace_path';
}
