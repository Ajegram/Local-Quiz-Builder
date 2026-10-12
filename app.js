const DEFAULT_REVIEWER = {
  title: 'CPE107-4 Quiz 3 Reviewer',
  course: 'Logic Circuits and Design',
  subtitle: 'Practice and review key digital logic concepts',
  description: 'A compact offline review set for targeted quiz preparation.'
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const state = {
  reviewer: { ...DEFAULT_REVIEWER },
  importedFiles: [],
  questions: [],
  summary: {
    total: 0,
    single: 0,
    multiple: 0,
    truefalse: 0,
    topics: 0,
    warnings: 0,
    errors: 0
  },
  config: {
    shuffleQuestions: false,
    shuffleChoices: false,
    showExplanations: true,
    allowPrevious: true,
    saveProgress: true,
    showTopics: true,
    flashcardMode: false,
    showAdditionalDetails: true,
    theme: 'dark-blue',
    customAccent: '#4f8cff'
  }
};

const elements = {};

document.addEventListener('DOMContentLoaded', init);

function init() {
  cacheElements();
  bindEvents();
  setDefaults();
  renderImportedFiles();
  renderFilters();
  renderEditor();
  updateSummary();
}

function cacheElements() {
  elements.markdownInput = document.getElementById('markdownInput');
  elements.markdownTextarea = document.getElementById('markdownTextarea');
  elements.aiPromptText = document.getElementById('aiPromptText');
  elements.copyAiPromptBtn = document.getElementById('copyAiPromptBtn');
  elements.aiPromptCopyStatus = document.getElementById('aiPromptCopyStatus');
  elements.browseFilesBtn = document.getElementById('browseFilesBtn');
  elements.dropZone = document.getElementById('dropZone');
  elements.clearFilesBtn = document.getElementById('clearFilesBtn');
  elements.importedFilesList = document.getElementById('importedFilesList');
  elements.reviewerTitle = document.getElementById('reviewerTitle');
  elements.courseName = document.getElementById('courseName');
  elements.reviewerSubtitle = document.getElementById('reviewerSubtitle');
  elements.reviewerDescription = document.getElementById('reviewerDescription');
  elements.parseBtn = document.getElementById('parseBtn');
  elements.summaryQuestions = document.getElementById('summaryQuestions');
  elements.summarySingle = document.getElementById('summarySingle');
  elements.summaryMultiple = document.getElementById('summaryMultiple');
  elements.summaryTrueFalse = document.getElementById('summaryTrueFalse');
  elements.summaryTopics = document.getElementById('summaryTopics');
  elements.summaryWarnings = document.getElementById('summaryWarnings');
  elements.searchInput = document.getElementById('searchInput');
  elements.topicFilter = document.getElementById('topicFilter');
  elements.typeFilter = document.getElementById('typeFilter');
  elements.issueFilter = document.getElementById('issueFilter');
  elements.validateBtn = document.getElementById('validateBtn');
  elements.addQuestionBtn = document.getElementById('addQuestionBtn');
  elements.questionEditor = document.getElementById('questionEditor');
  elements.shuffleQuestions = document.getElementById('shuffleQuestions');
  elements.shuffleChoices = document.getElementById('shuffleChoices');
  elements.showExplanations = document.getElementById('showExplanations');
  elements.allowPrevious = document.getElementById('allowPrevious');
  elements.saveProgress = document.getElementById('saveProgress');
  elements.showTopics = document.getElementById('showTopics');
  elements.flashcardMode = document.getElementById('flashcardMode');
  elements.showAdditionalDetails = document.getElementById('showAdditionalDetails');
  elements.themeSelect = document.getElementById('themeSelect');
  elements.customAccent = document.getElementById('customAccent');
  elements.customAccentWrap = document.getElementById('customAccentWrap');
  elements.exportJsonBtn = document.getElementById('exportJsonBtn');
  elements.importJsonBtn = document.getElementById('importJsonBtn');
  elements.jsonImportInput = document.getElementById('jsonImportInput');
  elements.generateBtn = document.getElementById('generateBtn');
}

function setDefaults() {
  elements.reviewerTitle.value = DEFAULT_REVIEWER.title;
  elements.courseName.value = DEFAULT_REVIEWER.course;
  elements.reviewerSubtitle.value = DEFAULT_REVIEWER.subtitle;
  elements.reviewerDescription.value = DEFAULT_REVIEWER.description;
  elements.shuffleQuestions.checked = false;
  elements.shuffleChoices.checked = false;
  elements.showExplanations.checked = true;
  elements.allowPrevious.checked = true;
  elements.saveProgress.checked = true;
  elements.showTopics.checked = true;
  elements.flashcardMode.checked = false;
  elements.showAdditionalDetails.checked = true;
  elements.themeSelect.value = 'dark-blue';
  elements.customAccentWrap.classList.add('hidden');
  state.reviewer = { ...DEFAULT_REVIEWER };
  state.config = {
    shuffleQuestions: false,
    shuffleChoices: false,
    showExplanations: true,
    allowPrevious: true,
    saveProgress: true,
    showTopics: true,
    flashcardMode: false,
    showAdditionalDetails: true,
    theme: 'dark-blue',
    customAccent: '#4f8cff'
  };
}

function bindEvents() {
  elements.copyAiPromptBtn.addEventListener('click', copyAiPrompt);

  elements.browseFilesBtn.addEventListener('click', function () {
    elements.markdownInput.click();
  });

  elements.markdownInput.addEventListener('change', function (event) {
    addMarkdownFiles(event.target.files);
  });

  elements.clearFilesBtn.addEventListener('click', function () {
    state.importedFiles = [];
    elements.markdownInput.value = '';
    renderImportedFiles();
  });

  elements.dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    elements.dropZone.classList.add('dragover');
  });

  elements.dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    elements.dropZone.classList.remove('dragover');
  });

  elements.dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    elements.dropZone.classList.remove('dragover');
    addMarkdownFiles(event.dataTransfer.files);
  });

  elements.parseBtn.addEventListener('click', parseAllMarkdown);
  elements.validateBtn.addEventListener('click', function () {
    validateQuestionBank();
    renderEditor();
    updateSummary();
  });

  elements.searchInput.addEventListener('input', renderEditor);
  elements.topicFilter.addEventListener('change', renderEditor);
  elements.typeFilter.addEventListener('change', renderEditor);
  elements.issueFilter.addEventListener('change', renderEditor);

  elements.addQuestionBtn.addEventListener('click', function () {
    state.questions.push(makeBlankQuestion());
    renderFilters();
    renderEditor();
    updateSummary();
  });

  elements.themeSelect.addEventListener('change', function () {
    state.config.theme = elements.themeSelect.value;
    elements.customAccentWrap.classList.toggle('hidden', state.config.theme !== 'custom');
  });

  elements.customAccent.addEventListener('input', function () {
    state.config.customAccent = elements.customAccent.value;
  });

  elements.shuffleQuestions.addEventListener('change', function () {
    state.config.shuffleQuestions = elements.shuffleQuestions.checked;
  });

  elements.shuffleChoices.addEventListener('change', function () {
    state.config.shuffleChoices = elements.shuffleChoices.checked;
  });

  elements.showExplanations.addEventListener('change', function () {
    state.config.showExplanations = elements.showExplanations.checked;
  });

  elements.allowPrevious.addEventListener('change', function () {
    state.config.allowPrevious = elements.allowPrevious.checked;
  });

  elements.saveProgress.addEventListener('change', function () {
    state.config.saveProgress = elements.saveProgress.checked;
  });

  elements.showTopics.addEventListener('change', function () {
    state.config.showTopics = elements.showTopics.checked;
  });

  elements.flashcardMode.addEventListener('change', function () {
    state.config.flashcardMode = elements.flashcardMode.checked;
  });

  elements.showAdditionalDetails.addEventListener('change', function () {
    state.config.showAdditionalDetails = elements.showAdditionalDetails.checked;
  });

  elements.exportJsonBtn.addEventListener('click', exportQuestionBankJSON);
  elements.importJsonBtn.addEventListener('click', function () {
    elements.jsonImportInput.click();
  });

  elements.jsonImportInput.addEventListener('change', importQuestionBankJSON);

  elements.generateBtn.addEventListener('click', function () {
    if (!state.questions.length) {
      alert('There are no questions to generate. Import Markdown or add a question first.');
      return;
    }

    const validation = validateQuestionBank();
    const hasErrors = validation.errors > 0;
    if (hasErrors) {
      alert('The question bank contains errors. Fix them before exporting the reviewer.');
      renderEditor();
      updateSummary();
      return;
    }

    const html = generateReviewerHTML();
    const safeTitle = sanitizeFilename(state.reviewer.title || DEFAULT_REVIEWER.title);
    downloadText(html, safeTitle + '.html', 'text/html;charset=utf-8');
  });

  document.addEventListener('click', handleQuestionEditorClick);
  document.addEventListener('input', handleQuestionEditorInput);
  document.addEventListener('change', handleQuestionEditorInput);
}

async function copyAiPrompt() {
  const prompt = elements.aiPromptText.value;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(prompt);
    } else {
      elements.aiPromptText.focus();
      elements.aiPromptText.select();
      const copied = document.execCommand('copy');
      elements.aiPromptText.setSelectionRange(0, 0);
      if (!copied) {
        throw new Error('The browser did not allow copying. Select the prompt and copy it manually.');
      }
    }
    elements.aiPromptCopyStatus.textContent = 'Prompt copied. Paste it into your AI chat.';
  } catch (error) {
    elements.aiPromptCopyStatus.textContent = error.message || 'Could not copy the prompt. Select the text and copy it manually.';
  }
}

function addMarkdownFiles(fileList) {
  if (!fileList || !fileList.length) return;
  const accepted = [];
  Array.from(fileList).forEach(function (file) {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.md') || lower.endsWith('.markdown')) {
      accepted.push(file);
    }
  });

  if (!accepted.length) {
    alert('Only .md or .markdown files are supported.');
    return;
  }

  state.importedFiles = state.importedFiles.concat(accepted);
  renderImportedFiles();
}

function renderImportedFiles() {
  if (!state.importedFiles.length) {
    elements.importedFilesList.innerHTML = '<li class="empty-state">No Markdown files imported yet.</li>';
    return;
  }

  const html = state.importedFiles.map(function (file) {
    return '<li class="file-pill">' + escapeHtml(file.name) + '</li>';
  }).join('');
  elements.importedFilesList.innerHTML = html;
}

function parseAllMarkdown() {
  const manual = elements.markdownTextarea.value.trim();
  const sources = [];

  if (manual) {
    sources.push({ name: 'manual-markdown.md', content: manual });
  }

  if (!state.importedFiles.length && !manual) {
    alert('Please add Markdown input before parsing.');
    return;
  }

  const filePromises = Array.from(state.importedFiles).map(function (file) {
    return file.text().then(function (text) {
      return { name: file.name, content: text };
    });
  });

  Promise.all(filePromises).then(function (resolvedFiles) {
    resolvedFiles.forEach(function (file) {
      if (file.content && file.content.trim()) {
        sources.push({ name: file.name, content: file.content });
      }
    });

    const combined = [];
    sources.forEach(function (source) {
      if (source.content && source.content.trim()) {
        const parsed = parseMarkdownText(source.content, source.name);
        combined.push.apply(combined, parsed);
      }
    });

    if (!combined.length) {
      alert('No valid questions were detected. Please check the Markdown and try again.');
      return;
    }

    state.questions = combined.map(function (question, idx) {
      return Object.assign({}, question, {
        id: idx + 1,
        number: question.number || (idx + 1)
      });
    });

    const titleHint = extractTitleFromMarkdown(sources.map(function (source) { return source.content; }).join('\n\n'));
    if (titleHint && !elements.reviewerTitle.value.trim()) {
      elements.reviewerTitle.value = titleHint;
    }

    applyReviewerFromForm();
    renderFilters();
    renderEditor();
    updateSummary();
  }).catch(function (error) {
    alert('Unable to read imported Markdown files: ' + error.message);
  });
}

function parseMarkdownText(markdown, sourceName) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const questions = [];
  let topic = 'General';
  let currentBlock = [];
  let inQuestion = false;

  function flushBlock() {
    if (!currentBlock.length) return;
    const parsed = parseQuestionBlock(currentBlock, topic, sourceName);
    if (parsed) {
      questions.push(parsed);
    }
    currentBlock = [];
    inQuestion = false;
  }

  lines.forEach(function (rawLine) {
    const line = rawLine.trim();

    if (/^##\s*Topic:\s*/i.test(line)) {
      flushBlock();
      topic = line.replace(/^##\s*Topic:\s*/i, '').trim() || 'General';
      return;
    }

    if (/^###\s*Question\b/i.test(line)) {
      flushBlock();
      currentBlock = [rawLine];
      inQuestion = true;
      return;
    }

    if (/^---\s*$/.test(line) && inQuestion) {
      flushBlock();
      return;
    }

    if (inQuestion) {
      currentBlock.push(rawLine);
    }
  });

  flushBlock();
  return questions;
}

function parseQuestionBlock(block, topic, sourceName) {
  const questionLines = [];
  const optionList = [];
  let answerText = '';
  let explanation = '';
  let details = '';

  block.forEach(function (rawLine) {
    const line = rawLine.trim();
    if (!line) return;

    if (/^###\s*Question\b/i.test(line)) {
      return;
    }

    if (/^\*\*?(?:Answer)\s*:\s*/i.test(line) || /^Answer\s*:/i.test(line)) {
      answerText = line
        .replace(/^\*\*?(?:Answer)\s*:\s*/i, '')
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .trim();
      return;
    }

    if (/^\*\*?(?:Explanation)\s*:\s*/i.test(line) || /^Explanation\s*:/i.test(line)) {
      explanation = line
        .replace(/^\*\*?(?:Explanation)\s*:\s*/i, '')
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .trim();
      return;
    }

    if (/^\*\*?(?:Additional\s+details|Details|Additional|Note)\s*:\s*/i.test(line)) {
      details = line
        .replace(/^\*\*?(?:Additional\s+details|Details|Additional|Note)\s*:\s*/i, '')
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .trim();
      return;
    }

    const optionMatch = line.match(/^([A-Z])\s*[\.)]\s*(.+)$/i);
    if (optionMatch) {
      optionList.push(optionMatch[2].trim());
      return;
    }

    questionLines.push(line);
  });

  const questionText = questionLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const options = optionList.length ? optionList : ['True', 'False'];
  const answerMeta = extractAnswerInfo(answerText, options);

  if (!questionText && !options.length) {
    return null;
  }

  return {
    number: 1,
    question: questionText || 'Untitled question',
    options: options,
    correct: answerMeta.correct,
    explanation: explanation || 'No explanation provided.',
    details: details || '',
    topic: topic || 'General',
    type: answerMeta.type,
    sourceName: sourceName || 'markdown'
  };
}

function extractAnswerInfo(answerText, options) {
  const raw = String(answerText || '').trim();
  if (!raw) {
    return { correct: [], type: detectQuestionType(options, '') };
  }

  const letterMatches = raw.match(/[A-Z]/g) || [];
  if (letterMatches.length) {
    const answers = [];
    letterMatches.forEach(function (letter) {
      const numeric = LETTERS.indexOf(letter.toUpperCase());
      if (numeric >= 0 && numeric < options.length) {
        answers.push(numeric);
      }
    });
    const unique = uniqueNumbers(answers);
    if (unique.length) {
      return {
        correct: unique,
        type: detectQuestionType(options, raw)
      };
    }
  }

  const valueMatches = raw.split(/[\s,]+/).map(function (part) {
    return part.trim();
  }).filter(Boolean);
  const idxMatches = [];
  valueMatches.forEach(function (part) {
    options.forEach(function (opt, index) {
      if (normalizeText(opt) === normalizeText(part)) {
        idxMatches.push(index);
      }
    });
  });

  if (idxMatches.length) {
    return {
      correct: uniqueNumbers(idxMatches),
      type: detectQuestionType(options, raw)
    };
  }

  if (options.length === 2 && /true|false/i.test(raw)) {
    const answerIndex = options.findIndex(function (option) {
      return /true/i.test(option) || /false/i.test(option);
    });
    return {
      correct: answerIndex >= 0 ? [answerIndex] : [],
      type: 'truefalse'
    };
  }

  return {
    correct: [],
    type: detectQuestionType(options, raw)
  };
}

function detectQuestionType(options, answerText) {
  const normalized = String(answerText || '').toLowerCase();
  const trueFalse = options.length === 2 && (options.some(function (opt) { return /true/i.test(opt); }) || options.some(function (opt) { return /false/i.test(opt); }));
  if (trueFalse) return 'truefalse';
  if (/(,|\band\b)/i.test(normalized)) return 'multiple';
  if (/[A-Z]/.test(String(answerText || '')) && (String(answerText || '').match(/[A-Z]/g) || []).length > 1) return 'multiple';
  return 'single';
}

function uniqueNumbers(values) {
  return Array.from(new Set(values)).sort(function (a, b) { return a - b; });
}

function extractTitleFromMarkdown(markdown) {
  const match = String(markdown || '').match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

function applyReviewerFromForm() {
  state.reviewer.title = elements.reviewerTitle.value.trim() || DEFAULT_REVIEWER.title;
  state.reviewer.course = elements.courseName.value.trim() || DEFAULT_REVIEWER.course;
  state.reviewer.subtitle = elements.reviewerSubtitle.value.trim() || DEFAULT_REVIEWER.subtitle;
  state.reviewer.description = elements.reviewerDescription.value.trim() || DEFAULT_REVIEWER.description;
}

function validateQuestionBank() {
  const duplicateMap = new Map();
  state.questions.forEach(function (question) {
    const key = normalizeDuplicateKey(question.question);
    if (!key) return;
    if (!duplicateMap.has(key)) duplicateMap.set(key, []);
    duplicateMap.get(key).push(question.id);
  });

  state.questions.forEach(function (question) {
    const issues = { errors: [], warnings: [] };

    if (!question.question || !question.question.trim()) {
      issues.errors.push('Question text is missing.');
    }

    if (!Array.isArray(question.options) || !question.options.length) {
      issues.errors.push('Question without options.');
    }

    if (!Array.isArray(question.correct) || !question.correct.length) {
      issues.errors.push('Missing correct answer.');
    }

    if (!question.explanation || !String(question.explanation).trim()) {
      issues.errors.push('Explanation missing.');
    }

    const normalizedOptions = (question.options || []).map(function (option) { return String(option).trim(); });
    if (normalizedOptions.some(function (value) { return !value; })) {
      issues.errors.push('Answer choice is blank.');
    }

    if (question.type === 'multiple' && normalizedOptions.length < 2) {
      issues.errors.push('Multiple-answer question requires at least two choices.');
    }

    const duplicates = findDuplicateOptions(normalizedOptions);
    if (duplicates.length) {
      issues.errors.push('Duplicate answer choices detected: ' + duplicates.join(', '));
    }

    const invalid = (question.correct || []).some(function (answerIndex) {
      return answerIndex < 0 || answerIndex >= normalizedOptions.length;
    });
    if (invalid) {
      issues.errors.push('Correct answer index is invalid.');
    }

    const duplicateIds = duplicateMap.get(normalizeDuplicateKey(question.question)) || [];
    if (duplicateIds.length > 1) {
      issues.warnings.push('Possible duplicate question.');
    }

    if (question.type === 'single' && Array.isArray(question.correct) && question.correct.length > 1) {
      issues.warnings.push('Single-answer question has multiple correct answers.');
    }

    question.validation = issues;
  });

  const summary = {
    total: state.questions.length,
    single: state.questions.filter(function (q) { return q.type === 'single'; }).length,
    multiple: state.questions.filter(function (q) { return q.type === 'multiple'; }).length,
    truefalse: state.questions.filter(function (q) { return q.type === 'truefalse'; }).length,
    topics: new Set(state.questions.map(function (q) { return q.topic || 'General'; })).size,
    warnings: state.questions.reduce(function (totalCount, question) {
      return totalCount + ((question.validation && question.validation.warnings) ? question.validation.warnings.length : 0);
    }, 0),
    errors: state.questions.reduce(function (totalCount, question) {
      return totalCount + ((question.validation && question.validation.errors) ? question.validation.errors.length : 0);
    }, 0)
  };

  state.summary = summary;
  return summary;
}

function findDuplicateOptions(options) {
  const seen = new Map();
  const duplicates = [];
  options.forEach(function (option) {
    const key = normalizeDuplicateKey(option);
    if (!key) return;
    if (!seen.has(key)) {
      seen.set(key, 1);
    } else {
      seen.set(key, seen.get(key) + 1);
      if (seen.get(key) === 2) {
        duplicates.push(option);
      }
    }
  });
  return duplicates;
}

function normalizeDuplicateKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/^question\s*\d+\s*[:.-]?\s*/i, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderFilters() {
  const topics = ['all'];
  state.questions.forEach(function (question) {
    const label = question.topic || 'General';
    if (!topics.includes(label)) topics.push(label);
  });

  const current = elements.topicFilter.value || 'all';
  elements.topicFilter.innerHTML = topics.map(function (topic) {
    const label = topic === 'all' ? 'All topics' : topic;
    return '<option value="' + escapeHtml(topic) + '">' + escapeHtml(label) + '</option>';
  }).join('');

  if (topics.includes(current)) {
    elements.topicFilter.value = current;
  } else {
    elements.topicFilter.value = 'all';
  }
}

function renderEditor() {
  if (!state.questions.length) {
    elements.questionEditor.innerHTML = '<div class="empty-state">No questions available yet. Import Markdown or add a question.</div>';
    return;
  }

  const filtered = getFilteredQuestions();
  if (!filtered.length) {
    elements.questionEditor.innerHTML = '<div class="empty-state">No questions match the active filters.</div>';
    return;
  }

  const cards = filtered.map(function (question, index) {
    const issueState = getIssueState(question);
    const validationList = buildValidationList(question);
    const optionsHtml = (question.options || []).map(function (option, optionIndex) {
      const letter = LETTERS[optionIndex] || String(optionIndex + 1);
      return '<div class="option-item"><span class="option-tag">' + escapeHtml(letter) + '</span><input type="text" data-field="option" data-id="' + question.id + '" data-index="' + optionIndex + '" value="' + escapeHtml(option) + '" /></div>';
    }).join('');

    const cardClass = issueState === 'warning' ? 'question-card warning' : issueState === 'error' ? 'question-card error' : 'question-card';

    return '<article class="' + cardClass + '" data-id="' + question.id + '">'
      + '<div class="question-header">'
      + '<div class="question-title"><span class="badge">Q' + (index + 1) + '</span><span>Question ' + (question.number || (index + 1)) + '</span></div>'
      + '<div class="card-actions">'
      + '<button type="button" class="small-button" data-action="move-up" data-id="' + question.id + '">Move Up</button>'
      + '<button type="button" class="small-button" data-action="move-down" data-id="' + question.id + '">Move Down</button>'
      + '<button type="button" class="small-button" data-action="duplicate" data-id="' + question.id + '">Duplicate</button>'
      + '<button type="button" class="danger-button" data-action="delete" data-id="' + question.id + '">Delete</button>'
      + '</div>'
      + '</div>'
      + '<div class="question-layout">'
      + '<div class="question-form-grid">'
      + '<label><span>Question number</span><input type="number" data-field="number" data-id="' + question.id + '" value="' + escapeHtml(String(question.number || (index + 1))) + '" /></label>'
      + '<label><span>Topic</span><input type="text" data-field="topic" data-id="' + question.id + '" value="' + escapeHtml(question.topic || 'General') + '" /></label>'
      + '<label><span>Question text</span><textarea data-field="text" data-id="' + question.id + '">' + escapeHtml(question.question || '') + '</textarea></label>'
      + '<label><span>Question type</span><select data-field="type" data-id="' + question.id + '"><option value="single" ' + (question.type === 'single' ? 'selected' : '') + '>Single</option><option value="multiple" ' + (question.type === 'multiple' ? 'selected' : '') + '>Multiple</option><option value="truefalse" ' + (question.type === 'truefalse' ? 'selected' : '') + '>True/False</option></select></label>'
      + '<label><span>Correct answer(s)</span><input type="text" data-field="correct" data-id="' + question.id + '" value="' + escapeHtml(formatCorrectAnswer(question.correct, (question.options || []).length)) + '" /></label>'
      + '<label><span>Explanation</span><textarea data-field="explanation" data-id="' + question.id + '">' + escapeHtml(question.explanation || '') + '</textarea></label>'
      + '<label><span>Additional details</span><textarea data-field="details" data-id="' + question.id + '">' + escapeHtml(question.details || '') + '</textarea></label>'
      + '</div>'
      + '<div class="question-form-grid">'
      + '<div><label><span>Answer choices</span></label><div class="option-editor-list">' + optionsHtml + '<button type="button" class="small-button" data-action="add-option" data-id="' + question.id + '">Add Option</button></div></div>'
      + (validationList ? '<div><label><span>Validation</span></label><ul class="issue-list">' + validationList + '</ul></div>' : '')
      + '</div>'
      + '</div>'
      + '</article>';
  }).join('');

  elements.questionEditor.innerHTML = cards;
}

function buildValidationList(question) {
  const validation = question.validation || { errors: [], warnings: [] };
  const items = [];
  validation.errors.forEach(function (text) {
    items.push('<li class="error-text">' + escapeHtml(text) + '</li>');
  });
  validation.warnings.forEach(function (text) {
    items.push('<li class="warning">' + escapeHtml(text) + '</li>');
  });
  return items.join('');
}

function getIssueState(question) {
  const validation = question.validation || { errors: [], warnings: [] };
  if (validation.errors && validation.errors.length) return 'error';
  if (validation.warnings && validation.warnings.length) return 'warning';
  return 'ok';
}

function getFilteredQuestions() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const selectedTopic = elements.topicFilter.value || 'all';
  const selectedType = elements.typeFilter.value || 'all';
  const selectedIssue = elements.issueFilter.value || 'all';

  return state.questions.filter(function (question) {
    const matchesTopic = selectedTopic === 'all' || (question.topic || 'General') === selectedTopic;
    const matchesType = selectedType === 'all' || question.type === selectedType;

    const haystack = (question.question || '') + ' ' + (question.topic || 'General') + ' ' + (question.explanation || '');
    const matchesSearch = !query || haystack.toLowerCase().includes(query);

    const issueState = getIssueState(question);
    const matchesIssue = selectedIssue === 'all' || (selectedIssue === 'warning' && issueState === 'warning') || (selectedIssue === 'error' && issueState === 'error');

    return matchesTopic && matchesType && matchesSearch && matchesIssue;
  });
}

function handleQuestionEditorClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const index = state.questions.findIndex(function (question) { return question.id === id; });
  if (index === -1) return;

  if (action === 'move-up' && index > 0) {
    const temp = state.questions[index - 1];
    state.questions[index - 1] = state.questions[index];
    state.questions[index] = temp;
  }

  if (action === 'move-down' && index < state.questions.length - 1) {
    const temp = state.questions[index + 1];
    state.questions[index + 1] = state.questions[index];
    state.questions[index] = temp;
  }

  if (action === 'duplicate') {
    const copy = JSON.parse(JSON.stringify(state.questions[index]));
    copy.id = getNextQuestionId();
    copy.number = Number(copy.number || index + 1) + 1;
    state.questions.splice(index + 1, 0, copy);
  }

  if (action === 'delete') {
    state.questions.splice(index, 1);
  }

  if (action === 'add-option') {
    const q = state.questions[index];
    q.options.push('');
    q.correct = [];
  }

  renderFilters();
  renderEditor();
  updateSummary();
}

function handleQuestionEditorInput(event) {
  const target = event.target;
  const id = Number(target.dataset.id);
  if (!id || !target.dataset.field) return;

  const question = state.questions.find(function (entry) {
    return entry.id === id;
  });
  if (!question) return;

  const field = target.dataset.field;
  if (field === 'number') {
    question.number = Number(target.value) || 1;
  }

  if (field === 'topic') {
    question.topic = target.value || 'General';
  }

  if (field === 'text') {
    question.question = target.value;
  }

  if (field === 'type') {
    question.type = target.value || 'single';
    if (question.type === 'truefalse' && question.options.length !== 2) {
      question.options = ['True', 'False'];
    }
  }

  if (field === 'correct') {
    question.correct = parseCorrectInput(target.value, question.options.length || 0);
  }

  if (field === 'explanation') {
    question.explanation = target.value;
  }

  if (field === 'details') {
    question.details = target.value;
  }

  if (field === 'option') {
    const optionIndex = Number(target.dataset.index);
    if (!question.options[optionIndex]) {
      question.options[optionIndex] = '';
    }
    question.options[optionIndex] = target.value;
  }

  renderFilters();
  renderEditor();
  updateSummary();
}

function parseCorrectInput(value, optionCount) {
  if (!value || !String(value).trim()) return [];
  const rawTokens = String(value).split(/[\s,]+/).map(function (token) { return token.trim(); }).filter(Boolean);
  const output = [];

  rawTokens.forEach(function (token) {
    const upper = token.toUpperCase();
    if (/^[A-Z]$/.test(upper)) {
      const index = LETTERS.indexOf(upper);
      if (index >= 0 && index < optionCount) output.push(index);
      return;
    }

    const numeric = Number(token);
    if (Number.isInteger(numeric)) {
      const index = numeric - 1;
      if (index >= 0 && index < optionCount) output.push(index);
    }
  });

  return uniqueNumbers(output);
}

function formatCorrectAnswer(items, optionCount) {
  if (!Array.isArray(items) || !items.length) return '';
  return uniqueNumbers(items).map(function (index) {
    if (index >= 0 && index < optionCount) {
      return LETTERS[index] || String(index + 1);
    }
    return String(index + 1);
  }).join(', ');
}

function makeBlankQuestion() {
  return {
    id: getNextQuestionId(),
    number: state.questions.length + 1,
    question: 'New question',
    options: ['Option A', 'Option B'],
    correct: [0],
    explanation: 'Add an explanation here.',
    details: '',
    topic: 'General',
    type: 'single'
  };
}

function getNextQuestionId() {
  let max = 0;
  state.questions.forEach(function (question) {
    max = Math.max(max, Number(question.id) || 0);
  });
  return max + 1;
}

function updateSummary() {
  const summary = validateQuestionBank();
  elements.summaryQuestions.textContent = String(summary.total);
  elements.summarySingle.textContent = String(summary.single);
  elements.summaryMultiple.textContent = String(summary.multiple);
  elements.summaryTrueFalse.textContent = String(summary.truefalse);
  elements.summaryTopics.textContent = String(summary.topics);
  elements.summaryWarnings.textContent = String(summary.warnings + summary.errors);
}

function exportQuestionBankJSON() {
  applyReviewerFromForm();
  const payload = {
    metadata: {
      title: state.reviewer.title,
      course: state.reviewer.course,
      subtitle: state.reviewer.subtitle,
      description: state.reviewer.description
    },
    config: state.config,
    questions: state.questions.map(function (question) {
      return {
        id: question.id,
        number: question.number,
        question: question.question,
        options: question.options,
        correct: question.correct,
        explanation: question.explanation,
        details: question.details || '',
        topic: question.topic,
        type: question.type
      };
    })
  };

  const fileName = sanitizeFilename((state.reviewer.title || DEFAULT_REVIEWER.title)) + '.json';
  downloadText(JSON.stringify(payload, null, 2), fileName);
}

function importQuestionBankJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (loadEvent) {
    try {
      const raw = String(loadEvent.target && loadEvent.target.result ? loadEvent.target.result : '');
      const json = JSON.parse(raw);
      const list = Array.isArray(json.questions) ? json.questions : Array.isArray(json) ? json : [];
      if (!list.length) {
        throw new Error('No questions found in the JSON file.');
      }

      state.questions = list.map(function (item, idx) {
        const opts = Array.isArray(item.options) && item.options.length ? item.options.map(String) : ['True', 'False'];
        const correct = Array.isArray(item.correct) ? item.correct.map(Number).filter(Number.isFinite) : [];
        return {
          id: Number(item.id) || (idx + 1),
          number: Number(item.number) || (idx + 1),
          question: String(item.question || 'Question ' + (idx + 1)),
          options: opts,
          correct: uniqueNumbers(correct),
          explanation: String(item.explanation || ''),
          details: String(item.details || ''),
          topic: String(item.topic || 'General'),
          type: item.type || detectQuestionType(opts, Array.isArray(item.correct) ? String(item.correct.join(', ')) : '')
        };
      });

      if (json.metadata) {
        elements.reviewerTitle.value = json.metadata.title || elements.reviewerTitle.value;
        elements.courseName.value = json.metadata.course || elements.courseName.value;
        elements.reviewerSubtitle.value = json.metadata.subtitle || elements.reviewerSubtitle.value;
        elements.reviewerDescription.value = json.metadata.description || elements.reviewerDescription.value;
      }

      if (json.config) {
        elements.shuffleQuestions.checked = !!json.config.shuffleQuestions;
        elements.shuffleChoices.checked = !!json.config.shuffleChoices;
        elements.showExplanations.checked = json.config.showExplanations !== false;
        elements.allowPrevious.checked = json.config.allowPrevious !== false;
        elements.saveProgress.checked = json.config.saveProgress !== false;
        elements.showTopics.checked = json.config.showTopics !== false;
        elements.flashcardMode.checked = !!json.config.flashcardMode;
        elements.showAdditionalDetails.checked = json.config.showAdditionalDetails !== false;
        elements.themeSelect.value = json.config.theme || 'dark-blue';
        state.config = Object.assign({}, state.config, json.config);
      }

      applyReviewerFromForm();
      renderFilters();
      renderEditor();
      updateSummary();
    } catch (error) {
      alert('Unable to import JSON: ' + error.message);
    }
  };

  reader.readAsText(file);
  event.target.value = '';
}

function generateReviewerHTML() {
  applyReviewerFromForm();
  const reviewTitle = escapeHtml(state.reviewer.title || DEFAULT_REVIEWER.title);
  const courseName = escapeHtml(state.reviewer.course || DEFAULT_REVIEWER.course);
  const subtitle = escapeHtml(state.reviewer.subtitle || DEFAULT_REVIEWER.subtitle);
  const description = escapeHtml(state.reviewer.description || DEFAULT_REVIEWER.description);

  let bank = state.questions.map(function (question) {
    return {
      q: question.question,
      o: question.options,
      a: question.correct,
      e: question.explanation,
      d: question.details || '',
      t: question.topic || 'General',
      type: question.type || 'single'
    };
  });

  if (state.config.shuffleQuestions) {
    bank = shuffleArray(bank);
  }

  const themeClass = state.config.theme === 'light' ? 'light' : state.config.theme === 'dark-purple' ? 'purple' : 'blue';
  const accent = state.config.customAccent || '#4f8cff';
  const bankJson = JSON.stringify(bank, null, 2);
  const configJson = JSON.stringify({
    title: state.reviewer.title,
    course: state.reviewer.course,
    subtitle: state.reviewer.subtitle,
    description: state.reviewer.description,
    showExplanations: state.config.showExplanations,
    allowPrevious: state.config.allowPrevious,
    saveProgress: state.config.saveProgress,
    showTopics: state.config.showTopics,
    showAdditionalDetails: state.config.showAdditionalDetails,
    flashcardMode: state.config.flashcardMode,
    theme: state.config.theme,
    customAccent: accent,
    shuffleQuestions: state.config.shuffleQuestions,
    shuffleChoices: state.config.shuffleChoices,
    reviewerId: sanitizeFilename(state.reviewer.title || DEFAULT_REVIEWER.title)
  }, null, 2);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${reviewTitle}</title>
    <style>
      :root {
        --bg: #07131f;
        --bg-alt: #0d1d2d;
        --panel: rgba(10,18,28,0.9);
        --panel-soft: rgba(16,29,42,0.94);
        --text: #ecf5ff;
        --muted: #9bb3c5;
        --accent: ${accent};
        --accent-2: ${accent};
        --correct: #25c27f;
        --incorrect: #ef5d6f;
        --warning: #f4b95f;
        --border: rgba(148,163,184,0.16);
        --shadow: rgba(0,0,0,0.28);
      }
      body.light {
        --bg: #edf4ff;
        --bg-alt: #dfe9fb;
        --panel: rgba(255,255,255,0.9);
        --panel-soft: rgba(247,249,253,0.96);
        --text: #1a2232;
        --muted: #586987;
        --border: rgba(100,116,139,0.2);
        --shadow: rgba(50,64,106,0.12);
      }
      body.purple {
        --bg: #110d1d;
        --bg-alt: #1b1631;
        --panel: rgba(18,14,29,0.9);
        --panel-soft: rgba(26,19,40,0.94);
        --accent: #9b74ff;
        --accent-2: #7c63ff;
      }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, rgba(79,140,255,0.18), transparent 28%), var(--bg);
        color: var(--text);
      }
      .reviewer-shell { max-width: 980px; margin: 0 auto; padding: 28px 18px 42px; }
      .header-card { background: var(--panel); border: 1px solid var(--border); border-radius: 20px; padding: 22px 22px 16px; box-shadow: 0 18px 40px var(--shadow); }
      .course-tag { color: var(--muted); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 10px; }
      h1 { margin: 0; font-size: clamp(1.8rem, 3vw, 2.8rem); }
      .description { margin-top: 8px; color: var(--muted); line-height: 1.5; }
      .chip { background: rgba(148,163,184,0.06); border: 1px solid var(--border); border-radius: 999px; padding: 8px 12px; font-size: 0.75rem; color: var(--muted); }
      .quiz-panel { background: var(--panel-soft); border: 1px solid var(--border); border-radius: 20px; margin-top: 22px; padding: 18px; box-shadow: 0 18px 28px var(--shadow); }
      .top-controls { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
      .topic-badge { display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 999px; background: rgba(79,140,255,0.12); color: var(--accent); font-size: 0.75rem; border: 1px solid rgba(79,140,255,0.2); }
      .progress-wrap { width: min(280px, 100%); }
      .progress-bar { width: 100%; height: 10px; border-radius: 999px; background: rgba(148,163,184,0.12); overflow: hidden; margin-top: 6px; }
      .progress-fill { height: 100%; width: 0%; border-radius: inherit; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
      .status-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 14px 0 8px; }
      .question-meta { font-size: 0.8rem; color: var(--muted); }
      .score-box { display: flex; gap: 10px; align-items: center; font-weight: 600; }
      .question-text { margin: 18px 0; font-size: clamp(1.1rem, 3vw, 1.6rem); line-height: 1.5; }
      .option-list { display: grid; gap: 12px; margin-top: 18px; }
      .option-button { display: flex; align-items: center; justify-content: flex-start; gap: 12px; width: 100%; text-align: left; padding: 15px 16px; border-radius: 14px; border: 1px solid var(--border); background: rgba(148,163,184,0.05); color: var(--text); font-size: 1rem; cursor: pointer; }
      .option-button.selected { border-color: rgba(79,140,255,0.9); background: rgba(79,140,255,0.12); }
      .option-button.correct { border-color: rgba(37,194,127,0.8); background: rgba(37,194,127,0.12); }
      .option-button.incorrect { border-color: rgba(239,93,111,0.8); background: rgba(239,93,111,0.12); }
      .option-letter { display: inline-flex; width: 28px; height: 28px; border-radius: 8px; background: rgba(148,163,184,0.1); align-items: center; justify-content: center; font-weight: 700; }
      .details-box { margin-top: 18px; border: 1px solid var(--border); border-radius: 12px; background: rgba(148,163,184,0.04); padding: 14px 16px; }
      .details-box strong { display: block; margin-bottom: 6px; }
      .answer-controls { display: flex; justify-content: space-between; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
      .primary-button, .secondary-button { border-radius: 12px; border: none; padding: 11px 16px; font-weight: 700; cursor: pointer; }
      .primary-button { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; }
      .secondary-button { background: rgba(148,163,184,0.08); color: var(--text); border: 1px solid var(--border); }
      .feedback { margin-top: 18px; border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border); background: rgba(148,163,184,0.04); }
      .feedback.correct { border-color: rgba(37,194,127,0.5); background: rgba(37,194,127,0.1); }
      .feedback.incorrect { border-color: rgba(239,93,111,0.5); background: rgba(239,93,111,0.1); }
      .feedback-title { margin: 0 0 8px; font-size: 1.05rem; font-weight: 700; }
      .explanation { margin-top: 8px; color: var(--muted); line-height: 1.6; }
      .hidden { display: none !important; }
      .results-screen { background: var(--panel-soft); border: 1px solid var(--border); border-radius: 20px; padding: 18px; margin-top: 22px; box-shadow: 0 18px 28px var(--shadow); }
      .results-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 18px 0 20px; }
      .score-card { background: rgba(148,163,184,0.04); border: 1px solid var(--border); border-radius: 14px; padding: 18px 16px; }
      .score-card strong { display: block; font-size: 2rem; margin-top: 10px; }
      .mistake-list { display: grid; gap: 12px; margin-top: 16px; }
      .mistake-card { border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; background: rgba(148,163,184,0.03); }
      .mistake-meta { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--muted); font-size: 0.82rem; }
      .mistake-text { margin: 12px 0 8px; font-weight: 600; line-height: 1.4; }
      .correct-answer { margin: 10px 0; color: var(--muted); }
      @media (max-width: 720px) {
        .header-top, .top-controls, .status-row { flex-direction: column; align-items: flex-start; }
        .results-grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body class="${themeClass}">
    <div class="reviewer-shell">
      <div class="header-card">
        <p class="course-tag">${courseName}</p>
        <div class="header-top">
          <div>
            <h1>${reviewTitle}</h1>
            <div class="description">${description}</div>
          </div>
          <div class="chip">${subtitle}</div>
        </div>
      </div>

      <div id="questionScreen" class="quiz-panel">
        <div class="top-controls">
          <div class="topic-badge hidden" id="topicBadge"></div>
          <div class="progress-wrap">
            <div class="question-meta" id="questionMeta">Question 1 of 1</div>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
          </div>
        </div>

        <div class="status-row">
          <div class="question-meta" id="selectionNotice">Choose the best answer.</div>
          <div class="score-box"><span>Score</span><strong id="scoreCount">0</strong></div>
        </div>

        <div id="questionText" class="question-text"></div>
        <div id="detailsBox" class="details-box hidden"></div>
        <div id="optionList" class="option-list"></div>
        <div id="feedbackBox" class="feedback hidden"></div>

        <div class="answer-controls">
          <button type="button" id="prevBtn" class="secondary-button">← Previous</button>
          <button type="button" id="revealDetailsBtn" class="secondary-button hidden">Reveal details</button>
          <button type="button" id="submitAnswerBtn" class="primary-button">Submit Answer</button>
          <button type="button" id="nextBtn" class="primary-button">Next Question →</button>
        </div>
      </div>

      <div id="resultsScreen" class="results-screen hidden">
        <h2>Session results</h2>
        <div class="results-grid">
          <div class="score-card"><span>Total questions</span><strong id="resultsTotal">0</strong></div>
          <div class="score-card"><span>Correct</span><strong id="resultsCorrect">0</strong></div>
          <div class="score-card"><span>Percent</span><strong id="resultsPercent">0%</strong></div>
        </div>
        <div class="answer-controls"><button type="button" id="restartBtn" class="primary-button">Restart review</button></div>
        <div id="mistakeList" class="mistake-list"></div>
      </div>
    </div>

    <script>
      const BANK = ${bankJson};
      const REVIEWER_CONFIG = ${configJson};
      const REVIEWER_STATE = {
        currentIndex: 0,
        answers: Array(BANK.length).fill(null).map(function () { return []; }),
        submitted: {},
        detailsVisible: {},
        progress: {}
      };
      const els = {};

      function safeText(value) {
        return String(value == null ? "" : value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function arraysMatch(left, right) {
        if (!Array.isArray(left) || !Array.isArray(right)) return false;
        if (left.length !== right.length) return false;
        const a = left.slice().sort(function (x, y) { return x - y; });
        const b = right.slice().sort(function (x, y) { return x - y; });
        return a.every(function (value, index) { return value === b[index]; });
      }

      function saveProgress() {
        if (!REVIEWER_CONFIG.saveProgress) return;
        const payload = { currentIndex: REVIEWER_STATE.currentIndex, answers: REVIEWER_STATE.answers, submitted: REVIEWER_STATE.submitted, detailsVisible: REVIEWER_STATE.detailsVisible };
        localStorage.setItem("logic-reviewer-" + (REVIEWER_CONFIG.reviewerId || "reviewer"), JSON.stringify(payload));
      }

      function loadProgress() {
        if (!REVIEWER_CONFIG.saveProgress) return;
        try {
          const raw = localStorage.getItem("logic-reviewer-" + (REVIEWER_CONFIG.reviewerId || "reviewer"));
          if (!raw) return;
          const saved = JSON.parse(raw);
          if (!saved) return;
          REVIEWER_STATE.currentIndex = Number(saved.currentIndex) || 0;
          REVIEWER_STATE.answers = Array.isArray(saved.answers) ? saved.answers.map(function (entry) { return Array.isArray(entry) ? entry : []; }) : Array(BANK.length).fill(null).map(function () { return []; });
          REVIEWER_STATE.submitted = saved.submitted || {};
          REVIEWER_STATE.detailsVisible = saved.detailsVisible || {};
        } catch (error) {}
      }

      function renderQuestion() {
        const current = BANK[REVIEWER_STATE.currentIndex];
        if (!current) return;
        const selected = REVIEWER_STATE.answers[REVIEWER_STATE.currentIndex] || [];
        const submitted = REVIEWER_STATE.submitted[REVIEWER_STATE.currentIndex] === true;
        const detailsVisible = !!REVIEWER_STATE.detailsVisible[REVIEWER_STATE.currentIndex];
        const hasDetails = !!(current.d && String(current.d).trim());

        els.topicBadge.textContent = REVIEWER_CONFIG.showTopics && current.t ? current.t : "";
        els.topicBadge.classList.toggle("hidden", !(REVIEWER_CONFIG.showTopics && current.t));
        els.questionMeta.textContent = "Question " + (REVIEWER_STATE.currentIndex + 1) + " of " + BANK.length;
        els.questionText.innerHTML = safeText(current.q);

        els.optionList.innerHTML = current.o.map(function (option, optionIndex) {
          const isSelected = selected.includes(optionIndex);
          const isCorrect = current.a.includes(optionIndex);
          const classes = ["option-button"];
          if (isSelected) classes.push("selected");
          if (submitted && isCorrect) classes.push("correct");
          if (submitted && isSelected && !isCorrect) classes.push("incorrect");
          return '<button class="' + classes.join(' ') + '" type="button" data-option-index="' + optionIndex + '"><span class="option-letter">' + String.fromCharCode(65 + optionIndex) + '</span><span>' + safeText(option) + '</span></button>';
        }).join("");

        els.selectionNotice.textContent = current.type === "multiple" ? "Select all correct answers." : "Choose the best answer.";
        const progress = ((REVIEWER_STATE.currentIndex + 1) / BANK.length) * 100;
        els.progressFill.style.width = progress + "%";
        els.scoreCount.textContent = String(BANK.reduce(function (total, item, index) {
          return total + ((REVIEWER_STATE.submitted[index] === true && arraysMatch(REVIEWER_STATE.answers[index] || [], item.a)) ? 1 : 0);
        }, 0));

        els.submitAnswerBtn.disabled = selected.length === 0;
        els.submitAnswerBtn.classList.toggle("hidden", REVIEWER_CONFIG.flashcardMode && submitted);
        els.prevBtn.disabled = !REVIEWER_CONFIG.allowPrevious || REVIEWER_STATE.currentIndex === 0;
        els.prevBtn.style.opacity = REVIEWER_CONFIG.allowPrevious && REVIEWER_STATE.currentIndex > 0 ? "1" : "0.45";
        els.nextBtn.textContent = REVIEWER_STATE.currentIndex === BANK.length - 1 ? "Finish" : "Next Question →";
        els.revealDetailsBtn.classList.toggle("hidden", !(hasDetails && REVIEWER_CONFIG.showAdditionalDetails && !detailsVisible));
        els.detailsBox.classList.toggle("hidden", !(hasDetails && (detailsVisible || submitted || !REVIEWER_CONFIG.showAdditionalDetails)));

        if (hasDetails && REVIEWER_CONFIG.showAdditionalDetails) {
          els.detailsBox.innerHTML = detailsVisible || submitted ? '<strong>Additional details</strong><div>' + safeText(current.d) + '</div>' : '<strong>Additional details</strong><div>Tap reveal details to open the extra note.</div>';
        } else {
          els.detailsBox.innerHTML = "";
        }

        if (submitted) {
          const isCorrect = arraysMatch(selected, current.a);
          const correctText = current.a.map(function (value) { return String.fromCharCode(65 + value); }).join(', ');
          const feedbackText = isCorrect ? 'Correct!' : 'Incorrect. The correct answer' + (current.a.length > 1 ? 's are' : ' is') + ' ' + correctText + '.';
          const explanationHtml = REVIEWER_CONFIG.showExplanations ? '<div class="explanation"><strong>Explanation:</strong> ' + safeText(current.e || 'No explanation provided.') + '</div>' : '';
          els.feedbackBox.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
          els.feedbackBox.innerHTML = '<div class="feedback-title">' + (isCorrect ? '✓ Correct' : '✗ Not quite') + '</div><div>' + safeText(feedbackText) + '</div>' + explanationHtml;
          els.feedbackBox.classList.remove('hidden');
        } else {
          els.feedbackBox.classList.add('hidden');
          els.feedbackBox.innerHTML = '';
        }

        saveProgress();
      }

      function selectOption(index) {
        const current = BANK[REVIEWER_STATE.currentIndex];
        if (!current) return;
        const selected = REVIEWER_STATE.answers[REVIEWER_STATE.currentIndex] || [];
        if (current.type === 'multiple') {
          const next = selected.includes(index) ? selected.filter(function (item) { return item !== index; }) : selected.concat(index);
          REVIEWER_STATE.answers[REVIEWER_STATE.currentIndex] = next.slice().sort(function (a, b) { return a - b; });
        } else {
          REVIEWER_STATE.answers[REVIEWER_STATE.currentIndex] = [index];
        }
        renderQuestion();
      }

      function submitAnswer() {
        const current = BANK[REVIEWER_STATE.currentIndex];
        if (!current) return;
        const selected = REVIEWER_STATE.answers[REVIEWER_STATE.currentIndex] || [];
        if (!selected.length) return;
        REVIEWER_STATE.submitted[REVIEWER_STATE.currentIndex] = true;
        if (REVIEWER_CONFIG.showAdditionalDetails && current.d && String(current.d).trim()) {
          REVIEWER_STATE.detailsVisible[REVIEWER_STATE.currentIndex] = true;
        }
        renderQuestion();
      }

      function showResults() {
        const total = BANK.length;
        const correct = BANK.reduce(function (count, item, index) {
          return count + (REVIEWER_STATE.submitted[index] === true && arraysMatch(REVIEWER_STATE.answers[index] || [], item.a) ? 1 : 0);
        }, 0);
        const percent = total ? Math.round((correct / total) * 100) : 0;

        document.getElementById('questionScreen').classList.add('hidden');
        document.getElementById('resultsScreen').classList.remove('hidden');
        document.getElementById('resultsTotal').textContent = String(total);
        document.getElementById('resultsCorrect').textContent = String(correct);
        document.getElementById('resultsPercent').textContent = percent + '%';

        const mistakes = BANK.map(function (item, index) {
          const selected = REVIEWER_STATE.answers[index] || [];
          const isCorrect = arraysMatch(selected, item.a);
          return { item: item, index: index, selected: selected, isCorrect: isCorrect };
        }).filter(function (entry) { return !entry.isCorrect; });

        document.getElementById('mistakeList').innerHTML = mistakes.length ? mistakes.map(function (entry) {
          return '<div class="mistake-card"><div class="mistake-meta"><span>Question ' + (entry.index + 1) + '</span><span>' + (entry.selected.length ? 'Answered' : 'Unanswered') + '</span></div><div class="mistake-text">' + safeText(entry.item.q) + '</div><div class="correct-answer">Correct answer: ' + entry.item.a.map(function (value) { return String.fromCharCode(65 + value); }).join(', ') + '</div></div>';
        }).join('') : '<div class="mistake-card">No corrections needed — great work.</div>';
      }

      function goToNext() {
        if (REVIEWER_STATE.currentIndex >= BANK.length - 1) {
          showResults();
          return;
        }
        REVIEWER_STATE.currentIndex += 1;
        renderQuestion();
      }

      function goToPrevious() {
        if (REVIEWER_STATE.currentIndex > 0) {
          REVIEWER_STATE.currentIndex -= 1;
          renderQuestion();
        }
      }

      function setup() {
        els.questionMeta = document.getElementById('questionMeta');
        els.topicBadge = document.getElementById('topicBadge');
        els.progressFill = document.getElementById('progressFill');
        els.selectionNotice = document.getElementById('selectionNotice');
        els.scoreCount = document.getElementById('scoreCount');
        els.questionText = document.getElementById('questionText');
        els.optionList = document.getElementById('optionList');
        els.detailsBox = document.getElementById('detailsBox');
        els.feedbackBox = document.getElementById('feedbackBox');
        els.prevBtn = document.getElementById('prevBtn');
        els.revealDetailsBtn = document.getElementById('revealDetailsBtn');
        els.submitAnswerBtn = document.getElementById('submitAnswerBtn');
        els.nextBtn = document.getElementById('nextBtn');
        els.questionScreen = document.getElementById('questionScreen');
        els.resultsScreen = document.getElementById('resultsScreen');
        els.restartBtn = document.getElementById('restartBtn');

        els.revealDetailsBtn.addEventListener('click', function () {
          REVIEWER_STATE.detailsVisible[REVIEWER_STATE.currentIndex] = true;
          renderQuestion();
        });

        els.submitAnswerBtn.addEventListener('click', submitAnswer);
        els.prevBtn.addEventListener('click', goToPrevious);
        els.nextBtn.addEventListener('click', function () {
          if (REVIEWER_STATE.submitted[REVIEWER_STATE.currentIndex] === true || !REVIEWER_CONFIG.flashcardMode) {
            goToNext();
          } else {
            submitAnswer();
          }
        });

        els.optionList.addEventListener('click', function (event) {
          const button = event.target.closest('.option-button');
          if (!button) return;
          const index = Number(button.dataset.optionIndex);
          if (Number.isNaN(index)) return;
          selectOption(index);
        });

        els.restartBtn.addEventListener('click', function () {
          REVIEWER_STATE.currentIndex = 0;
          REVIEWER_STATE.answers = Array(BANK.length).fill(null).map(function () { return []; });
          REVIEWER_STATE.submitted = {};
          REVIEWER_STATE.detailsVisible = {};
          els.resultsScreen.classList.add('hidden');
          els.questionScreen.classList.remove('hidden');
          renderQuestion();
        });

        loadProgress();
        if (REVIEWER_CONFIG.shuffleQuestions) {
          BANK.sort(function () { return Math.random() - 0.5; });
        }
        renderQuestion();
      }

      setup();
    </script>
  </body>
</html>
`;
}

function sanitizeFilename(value) {
  const raw = String(value == null ? 'reviewer' : value)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim();

  const cleaned = raw
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'reviewer';

  return cleaned;
}

function downloadText(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 0);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeText(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function shuffleArray(values) {
  const copy = values.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}
