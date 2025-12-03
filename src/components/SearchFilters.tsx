import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/names";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedGender: string | null;
  onGenderChange: (gender: string | null) => void;
  categories: Category[];
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedGender,
  onGenderChange,
  categories,
}: SearchFiltersProps) => {
  const genders = [
    { id: "male", label: "Male ♂", icon: "♂" },
    { id: "female", label: "Female ♀", icon: "♀" },
    { id: "unisex", label: "Unisex ⚥", icon: "⚥" },
  ];

  const hasActiveFilters = selectedCategory || selectedGender || searchQuery;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or meaning..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-12 h-14 text-lg rounded-xl border-2 border-border/50 focus:border-primary bg-card/50 backdrop-blur-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => onSearchChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Category Filters */}
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
            className={`rounded-full ${
              selectedCategory === category.id 
                ? "bg-igala-gold text-foreground hover:bg-igala-gold/90" 
                : "hover:border-igala-gold/50 hover:text-igala-amber"
            }`}
          >
            {category.name}
          </Button>
        ))}

        <div className="w-px h-6 bg-border/50 mx-2" />

        {/* Gender Filters */}
        {genders.map((gender) => (
          <Button
            key={gender.id}
            variant={selectedGender === gender.id ? "default" : "outline"}
            size="sm"
            onClick={() => onGenderChange(selectedGender === gender.id ? null : gender.id)}
            className={`rounded-full ${
              selectedGender === gender.id 
                ? "bg-igala-coral text-accent-foreground hover:bg-igala-coral/90" 
                : "hover:border-igala-coral/50 hover:text-igala-coral"
            }`}
          >
            {gender.label}
          </Button>
        ))}

        {/* Clear All */}
        {hasActiveFilters && (
          <>
            <div className="w-px h-6 bg-border/50 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange("");
                onCategoryChange(null);
                onGenderChange(null);
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;