export interface HomeUiText {
  hero: {
    prefix: string;
    accent: string;
    suffix: string;
  };
  actions: {
    pack: string;
    processing: string;
    cancel: string;
    packAria: string;
    cancelAria: string;
    resetOptions: string;
    copy: string;
    copied: string;
    download: string;
    share: string;
    shared: string;
    openWithApp: string;
    shareAria: string;
    onlyMobile: string;
    runLocally: string;
  };
  options: {
    outputFormat: string;
    formatNames: {
      xml: string;
      markdown: string;
      plain: string;
    };
    includePatternsPrefix: string;
    globPatterns: string;
    includePatternsSuffix: string;
    includePatternsPlaceholder: string;
    includePatternsAria: string;
    ignorePatterns: string;
    ignorePatternsPlaceholder: string;
    ignorePatternsAria: string;
    outputFormatOptions: string;
    includeFileSummary: string;
    includeDirectoryStructure: string;
    showLineNumbers: string;
    outputParsableFormat: string;
    outputParsableInfoAria: string;
    outputParsableHelp: string;
    fileProcessingOptions: string;
    compressCode: string;
    compressInfoAria: string;
    compressHelp: string;
    removeComments: string;
    removeEmptyLines: string;
  };
  upload: {
    zipPlaceholder: string;
    folderPlaceholder: string;
    selectedPrefix: string;
    urlPlaceholder: string;
    urlInputAria: string;
    invalidRepositoryUrl: string;
    fileSelectionWarning: (threshold: number) => string;
  };
  fileSelection: {
    title: string;
    selectAll: string;
    deselectAll: string;
    selectAllAria: string;
    deselectAllAria: string;
    repackSelected: string;
    repacking: string;
    repackSelectedAria: (selectedCount: number) => string;
    selectedFilesSummary: (selected: number, total: number) => string;
    selectedCharsSummary: (selectedChars: number, totalChars: number) => string;
    tableAria: string;
    toggleAllFilesAria: string;
    filePath: string;
    chars: string;
    selectFileAria: (path: string) => string;
  };
  loading: {
    title: string;
    stages: Record<string, string>;
    sponsorHeader: string;
    sponsorTitle: string;
    sponsorSubtitle: string;
  };
  result: {
    tabs: {
      result: string;
      files: string;
    };
    repositoryInfo: string;
    repository: string;
    generatedAt: string;
    format: string;
    packSummary: string;
    totalFiles: string;
    totalTokens: string;
    totalSize: string;
    filesUnit: string;
    tokensUnit: string;
    charsUnit: string;
    topFiles: (count: number) => string;
    securityAlert: string;
    securityWarningDescription: string;
    copyCommandError: string;
    shareUnavailable: string;
    shareFailed: string;
  };
  errors: {
    tryCliInstead: string;
    cliGuidePrefix: string;
    cliToolLabel: string;
    cliGuideSuffix: string;
    requestTimedOut: string;
    requestCancelled: string;
    requestCancelledUnknown: string;
    unexpectedError: string;
    invalidFileType: (acceptedTypes: string[]) => string;
    fileTooLarge: (sizeMB: string, limitMB: string) => string;
    totalSizeTooLarge: (sizeMB: string, limitMB: string) => string;
    noFilesFound: string;
    validationFailed: string;
    multipleFilesNeedPreprocessor: string;
    processingFailed: string;
    noFilesSelected: string;
    noItemsFound: string;
    folderDropUnsupported: string;
    dropFolderNotFile: string;
    failedToProcessFolder: string;
    directoryTooDeep: (maxDepth: number) => string;
    tooManyFiles: (maxFiles: number) => string;
    failedToCreateZip: (message: string) => string;
    unknownError: string;
    uploadZipFile: string;
    folderEmpty: string;
    folderNameRequired: string;
  };
  support: {
    starLinkText: string;
    starSuffix: string;
  };
}

const enText: HomeUiText = {
  hero: {
    prefix: 'Pack your codebase into',
    accent: 'AI-friendly',
    suffix: 'formats',
  },
  actions: {
    pack: 'Pack',
    processing: 'Processing...',
    cancel: 'Cancel',
    packAria: 'Pack repository',
    cancelAria: 'Cancel processing',
    resetOptions: 'Reset all options to default values',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    share: 'Share',
    shared: 'Shared!',
    openWithApp: 'Open with your app',
    shareAria: 'Share output via mobile apps',
    onlyMobile: 'Only available on mobile devices',
    runLocally: 'Run locally:',
  },
  options: {
    outputFormat: 'Output Format',
    formatNames: {
      xml: 'XML',
      markdown: 'Markdown',
      plain: 'Plain',
    },
    includePatternsPrefix: 'Include Patterns (using',
    globPatterns: 'glob patterns',
    includePatternsSuffix: ')',
    includePatternsPlaceholder: 'Comma-separated patterns to include. e.g., src/**/*.ts',
    includePatternsAria: 'Include patterns',
    ignorePatterns: 'Ignore Patterns',
    ignorePatternsPlaceholder: 'Comma-separated patterns to ignore. e.g., **/*.test.ts,README.md',
    ignorePatternsAria: 'Ignore patterns',
    outputFormatOptions: 'Output Format Options',
    includeFileSummary: 'Include File Summary',
    includeDirectoryStructure: 'Include Directory Structure',
    showLineNumbers: 'Show Line Numbers',
    outputParsableFormat: 'Output Parsable Format',
    outputParsableInfoAria: 'More information about parsable format',
    outputParsableHelp:
      'Whether to escape the output based on the chosen style schema. Note that this can increase token count.',
    fileProcessingOptions: 'File Processing Options',
    compressCode: 'Compress Code',
    compressInfoAria: 'More information about code compression',
    compressHelp:
      'Utilize Tree-sitter to intelligently extract essential code signatures and structure while removing implementation details, significantly reducing token usage.',
    removeComments: 'Remove Comments',
    removeEmptyLines: 'Remove Empty Lines',
  },
  upload: {
    zipPlaceholder: 'Drop your ZIP file here or click to browse (max 10MB)',
    folderPlaceholder: 'Drop your folder here or click to browse (max 10MB)',
    selectedPrefix: 'Selected:',
    urlPlaceholder: 'GitHub repository URL or user/repo (e.g., yamadashy/repomix)',
    urlInputAria: 'GitHub repository URL',
    invalidRepositoryUrl: 'Please enter a valid GitHub repository URL (e.g., yamadashy/repomix)',
    fileSelectionWarning: (threshold) =>
      `Selecting more than ${threshold} files may cause processing issues or timeouts. Consider reducing your selection for better performance.`,
  },
  fileSelection: {
    title: 'File Selection',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selectAllAria: 'Select all files',
    deselectAllAria: 'Deselect all files',
    repackSelected: 'Re-pack Selected',
    repacking: 'Re-packing...',
    repackSelectedAria: (selectedCount) => `Re-pack ${selectedCount} selected files`,
    selectedFilesSummary: (selected, total) => `${selected} of ${total} files selected`,
    selectedCharsSummary: (selectedChars, totalChars) =>
      `${selectedChars.toLocaleString()} chars (${totalChars > 0 ? ((selectedChars / totalChars) * 100).toFixed(1) : '0.0'}%)`,
    tableAria: 'File selection table',
    toggleAllFilesAria: 'Select or deselect all files',
    filePath: 'File Path',
    chars: 'Chars',
    selectFileAria: (path) => `Select file ${path}`,
  },
  loading: {
    title: 'Processing repository...',
    stages: {
      'cache-check': 'Checking cache...',
      cloning: 'Cloning repository...',
      'repository-fetch': 'Fetching repository...',
      extracting: 'Extracting files...',
      processing: 'Processing files...',
    },
    sponsorHeader: 'Special thanks to:',
    sponsorTitle: 'Warp, built for coding with multiple AI agents',
    sponsorSubtitle: 'Available for MacOS, Linux, & Windows',
  },
  result: {
    tabs: {
      result: 'Result',
      files: 'File Selection',
    },
    repositoryInfo: 'Repository Info',
    repository: 'Repository',
    generatedAt: 'Generated At',
    format: 'Format',
    packSummary: 'Pack Summary',
    totalFiles: 'Total Files',
    totalTokens: 'Total Tokens',
    totalSize: 'Total Size',
    filesUnit: 'files',
    tokensUnit: 'tokens',
    charsUnit: 'chars',
    topFiles: (count) => `Top ${count} Files`,
    securityAlert: 'Security Alert',
    securityWarningDescription: 'The following files were excluded because they may contain sensitive information:',
    copyCommandError: 'Failed to copy command:',
    shareUnavailable: 'Share is only available on mobile devices',
    shareFailed: 'Share was cancelled or failed',
  },
  errors: {
    tryCliInstead: 'Try using the command line tool instead:',
    cliGuidePrefix: 'See ',
    cliToolLabel: 'Using the CLI Tool',
    cliGuideSuffix: ' for more details.',
    requestTimedOut: 'Request timed out.\nPlease consider using Include Patterns or Ignore Patterns to reduce the scope.',
    requestCancelled: 'Request was cancelled.',
    requestCancelledUnknown: 'Request was cancelled with an unknown reason.',
    unexpectedError: 'An unexpected error occurred',
    invalidFileType: (acceptedTypes) => `Please upload a ${acceptedTypes.join(' or ')} file`,
    fileTooLarge: (sizeMB, limitMB) => `File size (${sizeMB}MB) exceeds the ${limitMB}MB limit`,
    totalSizeTooLarge: (sizeMB, limitMB) => `Total size (${sizeMB}MB) exceeds the ${limitMB}MB limit`,
    noFilesFound: 'No files found',
    validationFailed: 'Validation failed',
    multipleFilesNeedPreprocessor: 'Multiple files require a preprocessor function',
    processingFailed: 'Processing failed',
    noFilesSelected: 'No files selected',
    noItemsFound: 'No items found',
    folderDropUnsupported: "Your browser doesn't support folder drop. Please use the browse button instead.",
    dropFolderNotFile: 'Please drop a folder, not a file.',
    failedToProcessFolder: 'Failed to process the folder. Please try again or use the browse button.',
    directoryTooDeep: (maxDepth) => `Directory structure too deep (max depth: ${maxDepth})`,
    tooManyFiles: (maxFiles) => `Too many files in directory structure (max files: ${maxFiles})`,
    failedToCreateZip: (message) => `Failed to create ZIP file: ${message}`,
    unknownError: 'Unknown error',
    uploadZipFile: 'Please upload a ZIP file',
    folderEmpty: 'The folder is empty.',
    folderNameRequired: 'Folder name is required',
  },
  support: {
    starLinkText: 'Star this project',
    starSuffix: ' if you find it useful!',
  },
};

const zhText: HomeUiText = {
  hero: {
    prefix: '将代码库打包为',
    accent: 'AI 友好',
    suffix: '格式',
  },
  actions: {
    pack: '开始打包',
    processing: '处理中...',
    cancel: '取消',
    packAria: '打包仓库',
    cancelAria: '取消处理',
    resetOptions: '将所有选项重置为默认值',
    copy: '复制',
    copied: '已复制',
    download: '下载',
    share: '分享',
    shared: '已分享',
    openWithApp: '用应用打开',
    shareAria: '通过移动端应用分享结果',
    onlyMobile: '仅支持移动设备',
    runLocally: '本地运行：',
  },
  options: {
    outputFormat: '输出格式',
    formatNames: {
      xml: 'XML',
      markdown: 'Markdown',
      plain: '纯文本',
    },
    includePatternsPrefix: '包含模式（使用',
    globPatterns: 'glob 模式',
    includePatternsSuffix: '）',
    includePatternsPlaceholder: '输入用逗号分隔的包含模式，例如：src/**/*.ts',
    includePatternsAria: '包含模式',
    ignorePatterns: '忽略模式',
    ignorePatternsPlaceholder: '输入用逗号分隔的忽略模式，例如：**/*.test.ts,README.md',
    ignorePatternsAria: '忽略模式',
    outputFormatOptions: '输出格式选项',
    includeFileSummary: '包含文件摘要',
    includeDirectoryStructure: '包含目录结构',
    showLineNumbers: '显示行号',
    outputParsableFormat: '输出可解析格式',
    outputParsableInfoAria: '查看可解析格式说明',
    outputParsableHelp: '是否根据所选格式 schema 对输出进行转义。注意这会增加 token 数量。',
    fileProcessingOptions: '文件处理选项',
    compressCode: '压缩代码',
    compressInfoAria: '查看代码压缩说明',
    compressHelp:
      '利用 Tree-sitter 智能提取关键代码签名和结构，移除实现细节，显著减少 token 使用量。',
    removeComments: '移除注释',
    removeEmptyLines: '移除空行',
  },
  upload: {
    zipPlaceholder: '将 ZIP 文件拖到这里，或点击选择（最大 10MB）',
    folderPlaceholder: '将文件夹拖到这里，或点击选择（最大 10MB）',
    selectedPrefix: '已选择：',
    urlPlaceholder: 'GitHub 仓库地址或 user/repo（例如：yamadashy/repomix）',
    urlInputAria: 'GitHub 仓库地址',
    invalidRepositoryUrl: '请输入有效的 GitHub 仓库地址（例如：yamadashy/repomix）',
    fileSelectionWarning: (threshold) =>
      `选择超过 ${threshold} 个文件可能导致处理问题或超时。建议减少选择范围以获得更好的性能。`,
  },
  fileSelection: {
    title: '文件选择',
    selectAll: '全选',
    deselectAll: '取消全选',
    selectAllAria: '全选文件',
    deselectAllAria: '取消全选文件',
    repackSelected: '重新打包所选文件',
    repacking: '正在重新打包...',
    repackSelectedAria: (selectedCount) => `重新打包 ${selectedCount} 个已选文件`,
    selectedFilesSummary: (selected, total) => `已选择 ${selected} / ${total} 个文件`,
    selectedCharsSummary: (selectedChars, totalChars) =>
      `${selectedChars.toLocaleString()} 个字符（${totalChars > 0 ? ((selectedChars / totalChars) * 100).toFixed(1) : '0.0'}%）`,
    tableAria: '文件选择表格',
    toggleAllFilesAria: '全选或取消全选全部文件',
    filePath: '文件路径',
    chars: '字符数',
    selectFileAria: (path) => `选择文件 ${path}`,
  },
  loading: {
    title: '正在处理仓库...',
    stages: {
      'cache-check': '正在检查缓存...',
      cloning: '正在克隆仓库...',
      'repository-fetch': '正在获取仓库...',
      extracting: '正在解压文件...',
      processing: '正在处理文件...',
    },
    sponsorHeader: '特别鸣谢：',
    sponsorTitle: 'Warp，专为多 AI agent 编码打造',
    sponsorSubtitle: '支持 macOS、Linux 和 Windows',
  },
  result: {
    tabs: {
      result: '结果',
      files: '文件选择',
    },
    repositoryInfo: '仓库信息',
    repository: '仓库',
    generatedAt: '生成时间',
    format: '格式',
    packSummary: '打包摘要',
    totalFiles: '文件总数',
    totalTokens: 'Token 总数',
    totalSize: '总大小',
    filesUnit: '个文件',
    tokensUnit: 'tokens',
    charsUnit: '字符',
    topFiles: (count) => `Top ${count} 文件`,
    securityAlert: '安全警告',
    securityWarningDescription: '以下文件已被排除，因为它们可能包含敏感信息：',
    copyCommandError: '复制命令失败：',
    shareUnavailable: '仅支持在移动设备上分享',
    shareFailed: '分享已取消或失败',
  },
  errors: {
    tryCliInstead: '试试改用命令行工具：',
    cliGuidePrefix: '更多说明请参见',
    cliToolLabel: '使用 CLI 工具',
    cliGuideSuffix: '',
    requestTimedOut: '请求超时。\n请考虑使用包含模式或忽略模式来缩小范围。',
    requestCancelled: '请求已取消。',
    requestCancelledUnknown: '请求已取消，原因未知。',
    unexpectedError: '发生了意外错误',
    invalidFileType: (acceptedTypes) => `请上传 ${acceptedTypes.join(' 或 ')} 文件`,
    fileTooLarge: (sizeMB, limitMB) => `文件大小（${sizeMB}MB）超过 ${limitMB}MB 限制`,
    totalSizeTooLarge: (sizeMB, limitMB) => `总大小（${sizeMB}MB）超过 ${limitMB}MB 限制`,
    noFilesFound: '未找到文件',
    validationFailed: '校验失败',
    multipleFilesNeedPreprocessor: '多个文件需要预处理函数',
    processingFailed: '处理失败',
    noFilesSelected: '未选择文件',
    noItemsFound: '未找到条目',
    folderDropUnsupported: '当前浏览器不支持拖拽文件夹，请改用选择按钮。',
    dropFolderNotFile: '请拖入文件夹，而不是文件。',
    failedToProcessFolder: '处理文件夹失败，请重试或改用选择按钮。',
    directoryTooDeep: (maxDepth) => `目录层级过深（最大层级：${maxDepth}）`,
    tooManyFiles: (maxFiles) => `目录中的文件过多（最大数量：${maxFiles}）`,
    failedToCreateZip: (message) => `创建 ZIP 文件失败：${message}`,
    unknownError: '未知错误',
    uploadZipFile: '请上传 ZIP 文件',
    folderEmpty: '文件夹为空。',
    folderNameRequired: '必须提供文件夹名称',
  },
  support: {
    starLinkText: '给项目点个 Star',
    starSuffix: '，如果你觉得它有帮助！',
  },
};

export function getHomeUiText(lang?: string): HomeUiText {
  const normalized = lang?.toLowerCase() ?? '';
  if (normalized.startsWith('zh')) {
    return zhText;
  }
  return enText;
}
