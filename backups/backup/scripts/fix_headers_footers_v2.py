import os
import re
import glob
import shutil

# 排除的文件 - 确保全局布局不被修改
EXCLUDED_FILES = ['app/layout.tsx']

# 要处理的目录
APP_DIR = 'app'

# 备份目录
BACKUP_DIR = 'backup2'

def process_file(file_path):
    print(f"检查文件: {file_path}")
    
    # 检查是否是排除文件
    if file_path in EXCLUDED_FILES or os.path.basename(file_path) == 'layout.tsx':
        print(f"跳过 {file_path} (排除文件)")
        return False
    
    # 读取文件内容
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"读取文件失败 {file_path}: {e}")
        return False
    
    # 检查是否包含Header和Footer的导入和使用
    # 使用更严格的正则表达式匹配
    header_import = re.search(r'import\s+Header\s+from\s+[\'"].*?[\'"]', content)
    footer_import = re.search(r'import\s+Footer\s+from\s+[\'"].*?[\'"]', content)
    
    # 检查JSX中的使用
    header_jsx = re.search(r'<Header\s*\/?>|<Header\s*>.*?<\/Header>', content, re.DOTALL)
    footer_jsx = re.search(r'<Footer\s*\/?>|<Footer\s*>.*?<\/Footer>', content, re.DOTALL)
    
    if not ((header_import and header_jsx) or (footer_import and footer_jsx)):
        print(f"文件不需要处理 {file_path}")
        return False
    
    # 创建备份
    backup_path = os.path.join(BACKUP_DIR, os.path.basename(file_path))
    backup_count = 1
    while os.path.exists(backup_path):
        backup_path = os.path.join(BACKUP_DIR, f"{os.path.basename(file_path)}.{backup_count}")
        backup_count += 1
    
    try:
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已备份到 {backup_path}")
    except Exception as e:
        print(f"备份文件失败 {file_path}: {e}")
        return False
    
    # 处理文件内容
    modified_content = content
    
    # 替换导入语句
    if header_import:
        modified_content = re.sub(r'import\s+Header\s+from\s+[\'"].*?[\'"]', '// Header import removed', modified_content)
    
    if footer_import:
        modified_content = re.sub(r'import\s+Footer\s+from\s+[\'"].*?[\'"]', '// Footer import removed', modified_content)
    
    # 处理JSX中的Header和Footer组件
    if header_jsx:
        # 处理自闭合标签 <Header />
        modified_content = re.sub(r'<Header\s*\/>', '', modified_content)
        # 处理开闭合标签 <Header>...</Header>
        modified_content = re.sub(r'<Header\s*>.*?<\/Header>', '', modified_content, flags=re.DOTALL)
    
    if footer_jsx:
        # 处理自闭合标签 <Footer />
        modified_content = re.sub(r'<Footer\s*\/>', '', modified_content)
        # 处理开闭合标签 <Footer>...</Footer>
        modified_content = re.sub(r'<Footer\s*>.*?<\/Footer>', '', modified_content, flags=re.DOTALL)
    
    # 处理可能的空Fragment
    # 注意：下面的正则表达式可能会错误地匹配一些代码，所以我们做一次简单检查
    if re.search(r'<>\s*<main.*?<\/main>\s*<\/>', modified_content, re.DOTALL):
        modified_content = re.sub(r'<>\s*(<main.*?<\/main>)\s*<\/>', r'\1', modified_content, flags=re.DOTALL)
    
    # 写回文件
    if content != modified_content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            print(f"已修改 {file_path}")
            return True
        except Exception as e:
            print(f"写入文件失败 {file_path}: {e}")
            return False
    else:
        print(f"文件内容未变更 {file_path}")
        return False

def find_files_with_header_footer():
    """找出所有包含Header和Footer的文件"""
    result = []
    tsx_files = glob.glob(f"{APP_DIR}/**/*.tsx", recursive=True)
    
    for file_path in tsx_files:
        # 排除layout.tsx文件
        if file_path in EXCLUDED_FILES or os.path.basename(file_path) == 'layout.tsx':
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 检查是否同时包含Header和Footer
            has_header = 'import Header' in content and ('<Header' in content or '</Header>' in content)
            has_footer = 'import Footer' in content and ('<Footer' in content or '</Footer>' in content)
            
            if has_header and has_footer:
                result.append(file_path)
        except Exception as e:
            print(f"检查文件失败 {file_path}: {e}")
    
    return result

def main():
    # 确保备份目录存在
    os.makedirs(BACKUP_DIR, exist_ok=True)
    print(f"备份目录: {BACKUP_DIR}")
    
    # 找出所有包含Header和Footer的文件
    files_to_process = find_files_with_header_footer()
    print(f"找到 {len(files_to_process)} 个需要处理的文件")
    
    # 处理每个文件
    modified_count = 0
    for file_path in files_to_process:
        if process_file(file_path):
            modified_count += 1
    
    print(f"共修改了 {modified_count} 个文件")
    print("处理完成！")

if __name__ == "__main__":
    main() 