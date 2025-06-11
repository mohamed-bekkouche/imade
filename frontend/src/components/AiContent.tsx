import React from "react";

interface ContentItem {
  type: "paragraph" | "list";
  text?: string;
  items?: string[];
}

interface Example {
  name: string;
  description: string;
}

interface Section {
  title: string;
  description: string;
  content: ContentItem[];
  examples: Example[];
}

export interface AIContent {
  mainTitle: string;
  sections: Section[];
}

interface Props {
  aiContent: AIContent;
}

const AIContentRenderer: React.FC<Props> = ({ aiContent }) => {
  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4">
            {item.text}
          </p>
        );
      case "list":
        return (
          <ul key={index} className="list-disc pl-6 mb-4">
            {item.items?.map((listItem, i) => (
              <li key={i} className="mb-2">
                {listItem}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {aiContent.mainTitle}
      </h1>

      {aiContent.sections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          <p className="mb-6 text-gray-700">{section.description}</p>

          <div className="mb-6">
            {section.content.map((contentItem, contentIndex) =>
              renderContentItem(contentItem, contentIndex)
            )}
          </div>

          {section.examples.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Examples</h3>
              <div className="space-y-4">
                {section.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="mb-4 last:mb-0">
                    <h4 className="font-bold text-gray-800">{example.name}</h4>
                    <p className="text-gray-600">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default AIContentRenderer;
