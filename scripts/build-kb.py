#!/usr/bin/env python3
"""Build the JSON knowledge-base files that amit.agent (index.html) retrieves over.

Outputs (repo root, fetched by index.html at load time):
  posts-kb.json   - chunks of every blog post / book review (blog-*.html, book-review-*.html)
  resume-kb.json  - sections of the resume PDF (pubs/Amit_kumar.pdf)
  talks-kb.json   - slide text of the presentation decks in pubs/

Needs `pdftotext` (poppler) on PATH for the PDF parts; the posts part is pure Python.
Re-run after editing a post or dropping a new PDF:   python3 scripts/build-kb.py
"""
import glob, html, json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CHUNK_CHARS = 1500          # target size of one retrieval chunk
MAX_CHUNKS_PER_DOC = 6      # keep the index small; long decks get truncated (logged)

# Personal phone numbers never go into the agent's memory, even though the PDF is public.
PHONE_RE = re.compile(r'(?:\+?\d[\d\s\-]{8,}\d)')


def clean(text):
    text = PHONE_RE.sub('[phone withheld]', text)
    text = text.replace(' ', ' ')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n', text)
    return text.strip()


def chunk_paragraphs(paragraphs, size=CHUNK_CHARS):
    """Greedy: pack whole paragraphs into chunks of about `size` chars."""
    chunks, cur = [], ''
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if cur and len(cur) + len(p) + 1 > size:
            chunks.append(cur)
            cur = p
        else:
            cur = (cur + '\n' + p) if cur else p
    if cur:
        # A dangling stub (a nav crumb, a closing line) is noise as its own chunk.
        if chunks and len(cur) < 200:
            chunks[-1] += '\n' + cur
        else:
            chunks.append(cur)
    return chunks


def emit(doc_id, section, title, chunks, url, tags, date=None):
    total = len(chunks)
    if total > MAX_CHUNKS_PER_DOC:
        print(f'  ! {doc_id}: {total} chunks, keeping first {MAX_CHUNKS_PER_DOC}')
        chunks = chunks[:MAX_CHUNKS_PER_DOC]
        total = MAX_CHUNKS_PER_DOC
    out = []
    for i, text in enumerate(chunks, 1):
        item = {
            'id': f'{doc_id}-{i}',
            'section': section,
            'title': title if total == 1 else f'{title} (part {i}/{total})',
            'text': text,
            'url': url,
            'tags': tags,
        }
        if date:
            item['date'] = date
        out.append(item)
    return out


# ---------------------------------------------------------------- posts
POSTS = {
    'blog-streaming-llm.html':          ('2024-12', ['streamingllm', 'attention sinks', 'infinite context', 'kv cache', 'inference']),
    'blog-alphageometry.html':          ('2024-12', ['alphageometry', 'deepmind', 'neuro-symbolic', 'geometry', 'olympiad', 'imo', 'reasoning']),
    'blog-infini-attention.html':       ('2024-12', ['infini-attention', 'compressive memory', 'infinite context', 'transformer', 'google']),
    'blog-galore.html':                 ('2024-12', ['galore', 'gradient projection', 'low-rank', 'memory-efficient training', 'optimizer']),
    'blog-warp.html':                   ('2024-12', ['warp', 'rlhf', 'weight averaging', 'alignment', 'reward']),
    'blog-lars.html':                   ('2025-06', ['lars', 'least angle regression', 'sparse regression', 'lasso', 'feature selection']),
    'book-review-nurturing-quotient.html': ('2026-02', ['book review', 'nurturing quotient', 'leadership', 'hope', 'mile', 'aish', 'habits', 'apeejay']),
}


def html_to_paragraphs(path):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'<script.*?</script>|<style.*?</style>|<nav.*?</nav>', '', s, flags=re.S | re.I)
    s = re.sub(r'</(p|div|li|h[1-6]|blockquote|tr|section|article)>', '\n', s, flags=re.I)
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s)
    paras = [clean(p) for p in s.split('\n')]
    # drop nav crumbs and empties
    return [p for p in paras if p and not re.match(r'^(←|→|Home|Blog Index|Back to|Return to)', p)]


def build_posts():
    out = []
    for path, (date, tags) in POSTS.items():
        if not os.path.exists(path):
            print(f'  ! missing {path}, skipped')
            continue
        raw = open(path, encoding='utf-8').read()
        m = re.search(r'<title>(.*?)</title>', raw, flags=re.S | re.I)
        title = clean(html.unescape(m.group(1))) if m else path
        title = re.sub(r'\s*[-|–]\s*Amit Kumar\s*$', '', title)
        paras = html_to_paragraphs(path)
        paras = [p for p in paras if p != title]
        slug = re.sub(r'\.html$', '', path)
        out += emit('post-' + slug, 'Writing', title, chunk_paragraphs(paras), path,
                    ['blog', 'writing', 'post'] + tags, date)
    return out


# ---------------------------------------------------------------- pdf helpers
def pdf_pages(path, layout=False):
    if not shutil.which('pdftotext'):
        raise SystemExit('pdftotext not found (brew install poppler / apt install poppler-utils)')
    args = ['pdftotext'] + (['-layout'] if layout else []) + [path, '-']
    txt = subprocess.run(args, capture_output=True, text=True, check=True).stdout
    return [clean(p) for p in txt.split('\f')]


# ---------------------------------------------------------------- resume
RESUME_PDF = 'pubs/Amit_kumar.pdf'
RESUME_NOTE = '(Source: the current résumé PDF on the site.)'
HEADINGS = ['education', 'experience', 'projects', 'technical skills', 'achievements']
DATE_RE = re.compile(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)[a-z.]*\s+\d{4})\s*[–-]\s*(Present|(?:[A-Z][a-z.]*\s+)?\d{4})', re.I)
LOC_RE = re.compile(r'(,\s*(?:India|Karnataka|Kerala|Madhya Pradesh)|\bRemote)\s*$')


def experience_paragraphs(lines):
    """Turn the -layout Experience block into self-contained bullet paragraphs,
    each prefixed with the employer and role it belongs to."""
    paras, company, role, cur = [], '', '', None

    def flush():
        nonlocal cur
        if cur:
            paras.append(cur)
        cur = None

    for ln in lines:
        t = ln.strip()
        if not t:
            continue
        short = len(t.split()) <= 10
        if t.startswith(('◦', '•')):
            flush()
            cur = f'{company} · {role}: {t.lstrip("◦• ").strip()}'
        elif short and DATE_RE.search(t):
            flush()
            m = DATE_RE.search(t)
            role = f'{t[:m.start()].strip()} ({m.group(0)})'
        elif short and LOC_RE.search(t) and cur is None:
            company = t
        elif cur is not None:
            cur += ' ' + t
    flush()
    return paras


def build_resume():
    if not os.path.exists(RESUME_PDF):
        print(f'  ! missing {RESUME_PDF}, skipped')
        return []
    text = '\n'.join(pdf_pages(RESUME_PDF, layout=True))
    sections, cur, name = [], [], 'Header'
    for ln in text.split('\n'):
        if ln.strip().lower() in HEADINGS:
            sections.append((name, cur)); name, cur = ln.strip().title(), []
        else:
            cur.append(ln)
    sections.append((name, cur))
    out = []
    for name, body in sections:
        if name == 'Experience':
            chunks = chunk_paragraphs(experience_paragraphs(body))
            chunks = [c + '\n' + RESUME_NOTE for c in chunks]
        else:
            body_txt = clean('\n'.join(body))
            if not body_txt:
                continue
            body_txt = re.sub(r'\n\s*[•◦]\s*\n', '\n', body_txt)
            body_txt = re.sub(r'^\s*[•◦]\s*', '- ', body_txt, flags=re.M)
            chunks = [body_txt + '\n' + RESUME_NOTE]
        out += emit('resume-' + name.lower().replace(' ', '-'), 'Résumé (PDF)', name,
                    chunks, RESUME_PDF, ['resume', 'cv', 'pdf', name.lower()])
    return out


# ---------------------------------------------------------------- talks / decks
TALKS = {
    'How_to_Understand_any_model.pdf': ('Modern Language Model Architectures: From Papers to Practice', 2026,
        'Decoding architectural patterns across 19+ LLMs — what actually works and why.'),
    '2_simplical.pdf': ('Fast and Simplex: 2-Simplicial Attention in Triton', 2025,
        'Rethinking transformer attention with trilinear forms for better scaling laws under token constraints.'),
    'Sparse_Attention.pdf': ('Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention', 2025,
        'Efficient long-context modeling at 64K+ tokens with up to 9x speedup over FlashAttention-2.'),
    'StreamingLLM.pdf': ('StreamingLLM: Efficient Streaming Language Models with Attention Sinks', 2024,
        'Enabling infinite-context inference without KV cache explosion.'),
    'AlphaGeometry.pdf': ('AlphaGeometry: AI for Olympiad-Level Geometry', 2024,
        'Neuro-symbolic system combining language models with symbolic deduction.'),
    'Infini-attention.pdf': ('Infini-Attention: Infinite Context Transformers', 2024,
        'Compressive memory for infinite context length in transformers.'),
    'GaLore.pdf': ('GaLore: Memory-Efficient LLM Training', 2024,
        'Reducing fine-tuning memory footprint via gradient projection.'),
    'WARP.pdf': ('WARP: Weight Averaged Rewarded Policies for RLHF', 2024,
        'Improving reward stability and alignment in RLHF fine-tuning.'),
    'LARS.pdf': ('Least Angle Regression (LARS) on the Diabetes Dataset', 2021,
        'M.Tech coursework talk at IIST (Dept. of Mathematics, July 2021): the LARS algorithm for sparse regression, demonstrated on the diabetes dataset.'),
    'em.pdf': ('Latent Variable Models for Dimensionality Reduction', 2021,
        'M.Tech coursework talk at IIST (Dept. of Mathematics, July 2021): latent variable models, probabilistic PCA and the EM algorithm.'),
}


def build_talks():
    out = []
    for fname, (title, year, blurb) in TALKS.items():
        path = 'pubs/' + fname
        if not os.path.exists(path):
            print(f'  ! missing {path}, skipped')
            continue
        pages = [p for p in pdf_pages(path) if p]
        header = f'Presentation by Amit Kumar ({year}): {title}. {blurb}'
        chunks = chunk_paragraphs([header] + pages)
        tags = ['talk', 'presentation', 'slides', 'paper', str(year)] + \
               [w for w in re.findall(r'[a-z0-9-]+', title.lower()) if len(w) > 3]
        out += emit('talk-' + re.sub(r'\.pdf$', '', fname).lower(), 'Talks', title, chunks, path, tags, str(year))
    return out


def write(name, items):
    with open(name, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    print(f'{name}: {len(items)} chunks, {os.path.getsize(name)//1024} KB')


if __name__ == '__main__':
    write('posts-kb.json', build_posts())
    write('resume-kb.json', build_resume())
    write('talks-kb.json', build_talks())
