import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, IgalaName } from "@/types/names";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedGender: string | null;
  onGenderChange: (gender: string | null) => void;
  categories: Category[];
  allNames?: IgalaName[];
  onSelectName?: (name: IgalaName) => void;
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedGender,
  onGenderChange,
  categories,
  allNames = [],
  onSelectName,
}: SearchFiltersProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const genders = [
    { id: "male", label: "Male ♂", icon: "♂" },
    { id: "female", label: "Female ♀", icon: "♀" },
    { id: "unisex", label: "Unisex ⚥", icon: "⚥" },
  ];

  const hasActiveFilters = selectedCategory || selectedGender || searchQuery;

  // Get suggestions based on search query
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 1) return [];
    const query = searchQuery.toLowerCase();
    return allNames
      .filter(
        (name) =>
          name.name.toLowerCase().includes(query) ||
          name.meaning.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [searchQuery, allNames]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name: IgalaName) => {
    onSearchChange(name.name);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    if (onSelectName) {
      onSelectName(name);
    }
  };

  return (
    <div className="space-y-6 py-8 px-4">
      {/* Search Input with Autocomplete */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          placeholder="Search by name or meaning..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-12 h-14 text-lg rounded-xl border-2 border-border/50 focus:border-primary bg-card/50 backdrop-blur-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              onSearchChange("");
              setShowSuggestions(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {suggestions.map((name, index) => (
              <button
                key={name.id}
                onClick={() => handleSelectSuggestion(name)}
                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors ${
                  index === focusedIndex ? "bg-muted/50" : ""
                }`}
              >
                <div>
                  <span className="font-semibold text-foreground">{name.name}</span>
                  <span className="text-muted-foreground ml-2">— {name.meaning}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{name.category}</span>
              </button>
            ))}
          </div>
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
