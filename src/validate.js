const SCHEMAS = {
  '人格与方向.json': {
    required: ['name', '人生方向', '核心价值观', '性格特征', '人生原则', '身体档案', '工作档案', '睡眠模式'],
    fields: {
      '性格特征.type': ['完美主义倾向'],
      '身体档案.身高': 'number',
      '身体档案.旧伤': 'array',
      '身体档案.体态问题': 'array',
      '身体档案.当前能力.引体向上': 'number >=1',
      '身体档案.当前能力.俯卧撑': 'number >=1',
      '工作档案.工资': 'number',
      '工作档案.被动收入': 'number',
    },
  },

  '长期目标.json': {
    required: ['长期目标', '当前阶段', '阶段描述', '季度目标', '优先行动'],
    fields: {
      '季度目标[].状态': ['进行中', '待开始', '已完成', '已暂停'],
    },
  },

  '当前状态.json': {
    required: ['精力', '动量', '纪律', '疲劳', '压力', '阶段', '最后更新'],
    fields: {
      '精力': 'number 1-10',
      '动量': 'number 1-10',
      '纪律': 'number 1-10',
      '疲劳': 'number 1-10',
      '压力': 'number 1-10',
    },
  },

  '行为模式.json': {
    required: ['已知模式', '行为记录'],
    fields: {
      '已知模式': 'array',
    },
  },

  'AI观察记录.json': {
    required: ['观察记录'],
    fields: {
      '观察记录': 'array',
      '观察记录[].日期': 'string',
      '观察记录[].类型': ['用户规则', '系统变更', '模式确认', '系统初始化', '策略建议', '风险预警'],
      '观察记录[].内容': 'string',
    },
  },

  '环境信息.json': {
    required: ['工作', '训练设备', '居住环境', '可支配时间'],
    fields: {},
  },
};

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, key) => {
    if (key.endsWith('[]')) {
      const arrKey = key.slice(0, -2);
      return Array.isArray(o[arrKey]) ? o[arrKey] : undefined;
    }
    return o && o[key] !== undefined ? o[key] : undefined;
  }, obj);
}

function checkField(value, rule, fieldPath) {
  if (typeof rule === 'string') {
    if (rule === 'string') return typeof value === 'string' ? null : `应为 string`;
    if (rule === 'number') return typeof value === 'number' ? null : `应为 number`;
    if (rule === 'array') return Array.isArray(value) ? null : `应为 array`;
    if (rule === 'number 1-10') {
      if (typeof value !== 'number') return `应为 number`;
      if (value < 1 || value > 10) return `值 ${value} 超出范围 1-10`;
      return null;
    }
    if (rule === 'number >=1') {
      if (typeof value !== 'number') return `应为 number`;
      if (value < 1) return `值 ${value} 应 >= 1`;
      return null;
    }
  }
  if (Array.isArray(rule)) {
    const validValues = rule;
    if (!validValues.includes(value)) {
      return `值 "${value}" 不在允许范围 [${validValues.join(', ')}]`;
    }
    return null;
  }
  return null;
}

function validateJSON(fileName, data) {
  const schema = SCHEMAS[fileName];
  if (!schema) return [];

  const errors = [];

  for (const reqField of schema.required) {
    if (data[reqField] === undefined || data[reqField] === null) {
      errors.push(`缺失必填字段: ${reqField}`);
    }
  }

  for (const [fieldPath, rule] of Object.entries(schema.fields)) {
    const value = getNestedValue(data, fieldPath);
    if (value !== undefined) {
      const err = checkField(value, rule, fieldPath);
      if (err) errors.push(`${fieldPath}: ${err}`);
    }
  }

  return errors;
}

module.exports = { validateJSON, SCHEMAS };
