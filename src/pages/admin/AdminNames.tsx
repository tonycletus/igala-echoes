import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import namesData from "@/data/names.json";

const AdminNames = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNames = namesData.names.filter(
    (name) =>
      name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(namesData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "igala-names-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Names</h1>
          <p className="text-muted-foreground mt-1">
            Manage the Igala names database
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export JSON
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Names ({namesData.names.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Meaning</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pronunciation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNames.map((name) => (
                  <TableRow key={name.id}>
                    <TableCell className="font-medium">{name.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{name.meaning}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {name.gender}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {name.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {name.pronunciation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNames;
