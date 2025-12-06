import { useState, useMemo, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NameCard from "@/components/NameCard";
import NameDetailModal from "@/components/NameDetailModal";
import SearchFilters from "@/components/SearchFilters";
import FeaturedNames from "@/components/FeaturedNames";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { IgalaName, NamesData } from "@/types/names";
import namesData from "@/data/names.json";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const data = namesData as NamesData;
  const exploreRef = useRef<HTMLDivElement>(null);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<IgalaName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllNames, setShowAllNames] = useState(false);

  // Filter names based on search and filters
  const filteredNames = useMemo(() => {
    return data.names.filter((name) => {
      const matchesSearch =
        !searchQuery ||
        name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.origin_story.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || name.category === selectedCategory;
      const matchesGender = !selectedGender || name.gender === selectedGender;

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [data.names, searchQuery, selectedCategory, selectedGender]);

  const displayedNames = showAllNames ? filteredNames : filteredNames.slice(0, 3);

  const handleSelectName = (name: IgalaName) => {
    setSelectedName(name);
    setIsModalOpen(true);
  };

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Explore Section */}
      <section ref={exploreRef} className="pt-28 pb-20 bg-background pattern-igala">
        <div className="container px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-igala-olive to-igala-gold">
                All Names
              </span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Search through our collection of sacred Ìgálá names. Each name holds a universe of meaning.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-12">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
              categories={data.categories}
              allNames={data.names}
              onSelectName={handleSelectName}
            />
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground text-center">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {displayedNames.length}
              </span>
              {" of "}
              <span className="font-semibold text-foreground">{filteredNames.length}</span>
              {" names"}
              {(searchQuery || selectedCategory || selectedGender) && " matching your search"}
            </p>
          </div>

          {/* Names Grid */}
          {filteredNames.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedNames.map((name, index) => (
                  <div
                    key={name.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
                  >
                    <NameCard name={name} onSelect={handleSelectName} />
                  </div>
                ))}
              </div>
              {!showAllNames && filteredNames.length > 3 && (
                <div className="text-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    onClick={() => setShowAllNames(true)}
                  >
                    Explore All Names
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
              {showAllNames && filteredNames.length > 3 && (
                <div className="text-center mt-10">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full"
                    onClick={() => setShowAllNames(false)}
                  >
                    Show Less
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No names found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <Hero onExploreClick={scrollToExplore} />

      {/* Featured Names */}
      <FeaturedNames 
        names={data.names} 
        onSelectName={handleSelectName} 
        onExploreAll={() => {
          setShowAllNames(true);
          exploreRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Footer */}
      <Footer />

      {/* Name Detail Modal */}
      <NameDetailModal
        name={selectedName}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedName(null);
        }}
      />
    </main>
  );
};

export default Index;
