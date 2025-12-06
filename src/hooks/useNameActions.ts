import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useNameActions = (nameId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && nameId) {
      checkUserActions();
    }
  }, [user, nameId]);

  const checkUserActions = async () => {
    if (!user) return;

    const [likeRes, favRes] = await Promise.all([
      supabase
        .from("user_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("name_id", nameId)
        .maybeSingle(),
      supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("name_id", nameId)
        .maybeSingle(),
    ]);

    setIsLiked(!!likeRes.data);
    setIsFavorited(!!favRes.data);
  };

  const toggleLike = useCallback(async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like names.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("name_id", nameId);
        setIsLiked(false);
        toast({ title: "Removed from likes" });
      } else {
        await supabase
          .from("user_likes")
          .insert({ user_id: user.id, name_id: nameId });
        setIsLiked(true);
        toast({ title: "Added to likes!" });
      }
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, nameId, isLiked, toast]);

  const toggleFavorite = useCallback(async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("name_id", nameId);
        setIsFavorited(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, name_id: nameId });
        setIsFavorited(true);
        toast({ title: "Added to favorites!" });
      }
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, nameId, isFavorited, toast]);

  return {
    isLiked,
    isFavorited,
    isLoading,
    toggleLike,
    toggleFavorite,
  };
};
