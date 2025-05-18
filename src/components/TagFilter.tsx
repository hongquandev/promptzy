
import { Tag } from "@/types";

interface TagFilterProps {
  allTags: Tag[];
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
}

const TagFilter = ({ allTags, selectedTags, onToggleTag }: TagFilterProps) => {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by tags:</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onToggleTag(tag.id)}
            className={`tag ${selectedTags.includes(tag.id) ? 'tag-active' : ''}`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
