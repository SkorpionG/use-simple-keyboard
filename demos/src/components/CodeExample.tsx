import { CodeBlock } from './CodeBlock';

interface CodeExampleProps {
  title: string;
  code: string;
  language?: string;
}

export function CodeExample({
  title,
  code,
  language = 'typescript',
}: CodeExampleProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        {title}
      </h3>
      <CodeBlock code={code} language={language} showLineNumbers />
    </div>
  );
}
