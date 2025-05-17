import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 要创建的模块列表
const modulesToCreate = [
  {
    path: ['Dom', 'canUseDom.js'],
    content: `export default function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
`
  },
  {
    path: ['React', 'isFragment.js'],
    content: `import React from 'react';

export default function isFragment(node) {
  return React.isValidElement(node) && node.type === React.Fragment;
}
`
  },
  // 添加其他可能缺失的模块
  {
    path: ['Dom', 'dynamicCSS.js'],
    content: `// Inline implementation of canUseDom
const canUseDom = () => !!(typeof window !== 'undefined' && window.document && window.document.createElement);

let dynamicStyleSheet = null;

function getStyleSheet() {
  if (!canUseDom()) {
    return null;
  }

  if (!dynamicStyleSheet) {
    dynamicStyleSheet = document.createElement('style');
    dynamicStyleSheet.setAttribute('data-rc-util', 'dynamic');
    document.head.appendChild(dynamicStyleSheet);
  }

  return dynamicStyleSheet;
}

export function updateCSS(css, key) {
  const sheet = getStyleSheet();
  if (!sheet) {
    return null;
  }

  const styleId = \`rc-util-\${key}\`;
  let styleElem = document.getElementById(styleId);

  if (!styleElem) {
    styleElem = document.createElement('style');
    styleElem.setAttribute('id', styleId);
    sheet.parentNode.insertBefore(styleElem, sheet);
  }

  styleElem.textContent = css;

  return styleElem;
}

// 添加缺失的 removeCSS 函数导出
export function removeCSS(key) {
  if (!canUseDom()) {
    return null;
  }

  const styleId = \`rc-util-\${key}\`;
  const styleElem = document.getElementById(styleId);
  
  if (styleElem) {
    styleElem.parentNode.removeChild(styleElem);
  }
}
`
  },
  {
    path: ['Children', 'toArray.js'],
    content: `import React from 'react';
import isFragment from '../React/isFragment';

export default function toArray(children) {
  let ret = [];

  React.Children.forEach(children, function (child) {
    if (child === undefined || child === null) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children));
    } else {
      ret.push(child);
    }
  });

  return ret;
}
`
  }
];

// 创建模块 - rc-util
function createModules(basePackage) {
  modulesToCreate.forEach(module => {
    // 构建目录路径
    const dirPath = path.join(
      process.cwd(), 
      'node_modules', 
      basePackage, 
      'es', 
      ...module.path.slice(0, -1)
    );
    
    // 确保目录存在
    if (!fs.existsSync(dirPath)) {
      console.log('创建目录:', dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // 构建文件路径
    const filePath = path.join(dirPath, module.path[module.path.length - 1]);
    
    // 写入文件
    fs.writeFileSync(filePath, module.content);
    console.log('已创建文件:', filePath);
    
    // 对于每个.js文件，同时创建.mjs版本
    if (module.path[module.path.length - 1].endsWith('.js')) {
      const mfilePath = filePath.replace('.js', '.mjs');
      fs.writeFileSync(mfilePath, module.content);
      console.log('已创建ESM文件:', mfilePath);
    }
  });

  // 在每个创建的目录中添加package.json以指定模块类型
  const directoriesAdded = new Set();
  modulesToCreate.forEach(module => {
    const dirPath = path.join(
      process.cwd(), 
      'node_modules', 
      basePackage, 
      'es', 
      ...module.path.slice(0, -1)
    );
    
    if (!directoriesAdded.has(dirPath)) {
      const pkgPath = path.join(dirPath, 'package.json');
      const pkgContent = JSON.stringify({
        "name": module.path.slice(0, -1).join('-'),
        "type": "module"
      }, null, 2);
      fs.writeFileSync(pkgPath, pkgContent);
      console.log('已创建package.json:', pkgPath);
      directoriesAdded.add(dirPath);
    }
  });
}

// 修复 rc-util 模块
createModules('rc-util');
console.log('RC Util 模块修复完成！');

// 修复 @rc-component/util 模块
createModules('@rc-component/util');
console.log('@RC-Component/Util 模块修复完成！'); 