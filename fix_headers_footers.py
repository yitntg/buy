import os
import re
import shutil

# 排除的文件
EXCLUDED_FILES = ['app/layout.tsx']

# 要处理的目录
APP_DIR = 'app'

# 备份目录
BACKUP_DIR = 'backup'

def process_file(file_path):
    print(f"检查文件: {file_path}")
    
    # 排除指定文件
    for excluded in EXCLUDED_FILES:
        if excluded in file_path:
            print(f"跳过 {file_path}")
            return
    
    # 读取文件内容
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"读取文件失败 {file_path}: {e}")
        return
    
    # 检查是否包含Header和Footer的导入
    has_header = 'import Header' in content or '<Header' in content
    has_footer = 'import Footer' in content or '<Footer' in content
    
    if not (has_header and has_footer):
        print(f"文件不需要处理 {file_path} (Header: {has_header}, Footer: {has_footer})")
        return
    
    # 备份文件
    try:
        backup_path = os.path.join(BACKUP_DIR, os.path.basename(file_path))
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已备份到 {backup_path}")
    except Exception as e:
        print(f"备份文件失败 {file_path}: {e}")
        return
    
    print(f"处理文件: {file_path}")
    
    # 移除Header和Footer的导入
    content = re.sub(r'import\s+Header\s+from\s+[\'"].*?[\'"]', '// Header import removed', content)
    content = re.sub(r'import\s+Footer\s+from\s+[\'"].*?[\'"]', '// Footer import removed', content)
    
    # 检查JSX部分是否包含Header和Footer
    # 处理情况：<Header />
    content = re.sub(r'<Header\s*/>', '', content)
    content = re.sub(r'<Footer\s*/>', '', content)
    
    # 处理情况：<Header></Header>
    content = re.sub(r'<Header\s*>.*?</Header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<Footer\s*>.*?</Footer>', '', content, flags=re.DOTALL)
    
    # 替换掉外层的Fragment，如果它们只包含了main元素
    content = re.sub(r'<>\s*<main(.*?)</main>\s*</>', r'<main\1</main>', content, flags=re.DOTALL)
    
    # 写回文件
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已修改 {file_path}")
    except Exception as e:
        print(f"写入文件失败 {file_path}: {e}")

def process_directory(directory):
    # 遍历目录中的所有.tsx文件
    print(f"处理目录: {directory}")
    count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                process_file(file_path)
                count += 1
    
    print(f"共处理了 {count} 个文件")

if __name__ == "__main__":
    # 确保备份目录存在
    os.makedirs(BACKUP_DIR, exist_ok=True)
    print(f"备份目录: {BACKUP_DIR}")
    
    # 处理app目录
    process_directory(APP_DIR)
    
    print("处理完成！") 