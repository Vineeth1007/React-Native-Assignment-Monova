import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  Animated,
  ScrollView,
  Easing,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

/* =========================================================
   Design Tokens
   ========================================================= */
const COLOR = {
  page: "#FCFAF7",
  surface: "#FFFFFF",
  surfaceMuted: "#F6EFE8",
  text: "#1A1A1A",
  textMuted: "#8A8A8A",
  accent: "#FF9D3A",
  chipBorder: "#E7DDD2",
  divider: "#EFEAE3",
  // NEW: grey frame fill for image borders
  frame: "#E6E3DE",
};
const CARD_SNAP = 300; // approx. card + spacing; tweak 280–320 to taste
const RAD = { xs: 6, sm: 10, md: 14, lg: 20, xl: 24, pill: 999 };
const S = (n: number) => n * 4;

const SHADOW_LG = Platform.select({
  web: {
    shadowColor: "rgba(0,0,0,0.12)",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
  },
  default: { elevation: 6, shadowColor: "rgba(0,0,0,0.2)" },
}) as any;

const SHADOW_SM = Platform.select({
  web: {
    shadowColor: "rgba(0,0,0,0.10)",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  default: { elevation: 2, shadowColor: "rgba(0,0,0,0.18)" },
}) as any;

/* =========================================================
   Utilities
   ========================================================= */
function usePressScale() {
  const s = React.useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(s, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  const onPressOut = () =>
    Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  return { scale: s, onPressIn, onPressOut };
}

function useEntrance(index: number, baseDelay = 35) {
  const o = React.useRef(new Animated.Value(0)).current;
  const t = React.useRef(new Animated.Value(10)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 260, delay: index * baseDelay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(t, { toValue: 0, duration: 260, delay: index * baseDelay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [index]);
  return { style: { opacity: o, transform: [{ translateY: t }] } };
}

/* =========================================================
   Segmented Control
   ========================================================= */
type Segment = "Collections" | "Outfits" | "Items";
function Segmented({ value, onChange }: { value: Segment; onChange: (v: Segment) => void }) {
  const segs: Segment[] = ["Collections", "Outfits", "Items"];
  return (
    <View
      style={{
        backgroundColor: COLOR.surfaceMuted,
        borderRadius: RAD.pill,
        padding: 4,
        borderWidth: 1,
        borderColor: COLOR.chipBorder,
        alignSelf: "flex-start",
      }}
      accessible
      accessibilityRole="tablist"
      accessibilityLabel="Saved segments"
    >
      <View style={{ flexDirection: "row" }}>
        {segs.map((s, i) => {
          const active = value === s;
          const press = usePressScale();
          return (
            <Animated.View key={s} style={{ transform: [{ scale: press.scale }] }}>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPressIn={press.onPressIn}
                onPressOut={press.onPressOut}
                onPress={() => onChange(s)}
                style={[
                  {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    minWidth: 112,
                    borderRadius: RAD.pill,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: i !== segs.length - 1 ? 4 : 0,
                  },
                  active && [{ backgroundColor: COLOR.surface }, SHADOW_SM],
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: active ? "700" : "600",
                    color: active ? COLOR.text : COLOR.textMuted,
                  }}
                >
                  {s}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

/* =========================================================
   Generic Chip
   ========================================================= */
function Chip({
  label,
  kind = "solid",
  active = false,
  icon,
  onPress,
  size = "xs", // "md" | "sm" | "xs"
}: {
  label: string;
  kind?: "solid" | "dashed";
  active?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  size?: "md" | "sm" | "xs";
}) {
  const press = usePressScale();
  const isSm = size === "sm";
  const isXs = size === "xs";

  return (
    <Animated.View style={{ transform: [{ scale: press.scale }] }}>
      <Pressable
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={onPress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          {
            borderRadius: RAD.pill,
            paddingVertical: isXs ? 4 : isSm ? 6 : 8,
            paddingHorizontal: isXs ? 8 : isSm ? 10 : 16,
            minWidth: isXs ? 72 : isSm ? 84 : 112,
            minHeight: 40, // still >= 40px for accessibility
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
          },
          kind === "dashed" && {
            backgroundColor: COLOR.surface,
            borderWidth: 1,
            borderStyle: "dashed" as const,
            borderColor: COLOR.chipBorder,
          },
          kind === "solid" && {
            backgroundColor: active ? "#F2E6DA" : COLOR.surfaceMuted,
            borderWidth: active ? 1 : 0,
            borderColor: active ? "#E5D9CC" : "transparent",
          },
        ]}
      >
        {icon ? <View style={{ marginRight: 4 }}>{icon}</View> : null}
        <Text
          style={{
            fontSize: isXs ? 12 : isSm ? 13 : 16,
            fontWeight: active ? "700" : "600",
            color: COLOR.text,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}



/* =========================================================
   NEW: FramedImage -> grey border (fill) + shadow + inner image inset
   'container' controls the overall footprint (border appears bigger),
   'padding' controls how small the image sits inside.
   ========================================================= */
function FramedImage({
  uri,
  height,
  padding = 12,
  containerStyle,
  imageRadius = RAD.md,
}: {
  uri: string;
  height: number;
  padding?: number;
  containerStyle?: any;
  imageRadius?: number;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: COLOR.frame,
          borderRadius: RAD.lg,
          padding,
          height,
        },
        SHADOW_SM,
        containerStyle,
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%", borderRadius: imageRadius }}
        resizeMode="cover"
      />
    </View>
  );
}

/* =========================================================
   Collection Card
   - upgraded to 4 images: tallLeft + topRight + bottomRight + extraRight
   - main tallLeft shows thicker frame + smaller image
   ========================================================= */
type CollCard = {
  id: string;
  title: string;
  images: { tallLeft: string; topRight: string; bottomRight: string; extraRight: string };
  bookmarked?: boolean;
  tags?: string[];
};

function CollectionCard({ item, index }: { item: CollCard; index: number }) {
  const ent = useEntrance(index);
  const gridH = 244;

  return (
    <Animated.View
      style={[
        {
          backgroundColor: COLOR.surface,
          borderRadius: RAD.xl,
          padding: 12,
          marginBottom: 16,
        },
        SHADOW_LG,
        ent.style,
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${item.title} collection`}
    >
      <View style={{ flexDirection: "row", height: gridH }}>
        {/* Main (left) — smaller image inside a larger frame */}
        <FramedImage
          uri={item.images.tallLeft}
          height={gridH}
          padding={16} // thicker border look
          containerStyle={{ flex: 1, marginRight: 8 }}
          imageRadius={RAD.lg}
        />

        {/* Right: top full, bottom split into two (-> 3 tiles on right total) */}
        <View style={{ flex: 1 }}>
          <FramedImage
            uri={item.images.topRight}
            height={116}
            padding={10}
            containerStyle={{ marginBottom: 8 }}
          />
          <View style={{ flexDirection: "row" }}>
            <FramedImage
              uri={item.images.bottomRight}
              height={116}
              padding={10}
              containerStyle={{ flex: 1, marginRight: 8 }}
            />
            <FramedImage
              uri={item.images.extraRight}
              height={116}
              padding={10}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>

      {!!item.tags?.length && (
        <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap" }}>
          {item.tags.map((t) => (
            <View
              key={t}
              style={{
                backgroundColor: COLOR.surfaceMuted,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: RAD.pill,
                marginRight: 8,
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: COLOR.text }}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Floating bookmark chip */}
      <View
        style={[
          {
            position: "absolute",
            right: 14,
            bottom: 12,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLOR.surface,
            alignItems: "center",
            justifyContent: "center",
          },
          SHADOW_SM,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toggle bookmark"
      >
        <MaterialCommunityIcons
          name={item.bookmarked ? "bookmark" : "bookmark-outline"}
          size={22}
          color={COLOR.accent}
        />
      </View>
    </Animated.View>
  );
}

/* =========================================================
   Outfit Card (unchanged layout)
   ========================================================= */
type Outfit = {
  id: string;
  title: string;
  imgs: { top: string; bottom: string; footwear: string; outerwear?: string };
  tags: string[];
};

// STEP 1: Replace entire OutfitCard with this
function OutfitCard({ item, index }: { item: Outfit; index: number }) {
  const ent = useEntrance(index);
  const gridH = 240;

  return (
    <Animated.View
      style={[
        { backgroundColor: COLOR.surface, borderRadius: RAD.xl, padding: 12, marginBottom: 16 },
        SHADOW_LG,
        ent.style,
      ]}
    >
      {/* 4-tile layout with framed images (same look as Collections) */}
      <View style={{ flexDirection: "row", gap: 8 as any, height: gridH }}>
        {/* Left: Top */}
        <FramedImage
          uri={item.imgs.top}
          height={gridH}
          padding={12}
          containerStyle={{ flex: 1 }}
          imageRadius={RAD.lg}
        />

        {/* Right: Bottom (full width), then Footwear + Outerwear split */}
        <View style={{ flex: 1 }}>
          <FramedImage
            uri={item.imgs.bottom}
            height={Math.round((gridH - 8) / 2)}
            padding={10}
            containerStyle={{ marginBottom: 8 }}
            imageRadius={RAD.lg}
          />
          <View style={{ flexDirection: "row" }}>
            <FramedImage
              uri={item.imgs.footwear}
              height={Math.round((gridH - 8) / 2)}
              padding={10}
              containerStyle={{ flex: 1, marginRight: 8 }}
              imageRadius={RAD.lg}
            />
            {item.imgs.outerwear ? (
              <FramedImage
                uri={item.imgs.outerwear}
                height={Math.round((gridH - 8) / 2)}
                padding={10}
                containerStyle={{ flex: 1 }}
                imageRadius={RAD.lg}
              />
            ) : (
              // placeholder keeps layout when outerwear is missing
              <View style={{ flex: 1, borderRadius: RAD.lg, backgroundColor: COLOR.surfaceMuted }} />
            )}
          </View>
        </View>
      </View>

      {/* Title + chevron */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLOR.text }}>{item.title}</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={COLOR.textMuted} />
      </View>

      {/* Tags */}
      <View style={{ flexDirection: "row", marginTop: 8, flexWrap: "wrap" }}>
        {item.tags.map((t) => (
          <View key={t} style={{ backgroundColor: COLOR.surfaceMuted, paddingVertical: 6, paddingHorizontal: 10, borderRadius: RAD.pill, marginRight: 8, marginBottom: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: COLOR.text }}>{t}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}



/* =========================================================
   Items Grid (unchanged)
   ========================================================= */
type Item = {
  id: string;
  image: string;
  category: "Top" | "Bottom" | "Footwear" | "Outerwear";
  color: "Black" | "Blue" | "Brown" | "White";
  style: "Casual" | "Formal";
};

/** ---------- Images (remote URLs) */
export const IMG = {
  // Tops
  shirt_blue_1: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  shirt_blue_2: "https://images.unsplash.com/photo-1520975954732-35dd22f8a6d1?q=80&w=1200&auto=format&fit=crop",
  tee_plum:     "https://images.unsplash.com/photo-1503342452485-86ff0a2494f7?q=80&w=1200&auto=format&fit=crop",
  tee_mint:     "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
  shirt_white:  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",

  // Bottoms
  pants_black_1:"https://images.unsplash.com/photo-1520975922284-7b683d4816f2?q=80&w=1200&auto=format&fit=crop",
  pants_white:  "https://images.unsplash.com/photo-1520975954732-35dd22f8a6d1?q=80&w=1200&auto=format&fit=crop",
  pants_brown:  "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
  pants_blue:   "https://images.unsplash.com/photo-1542213493895-edf3f98f7e2b?q=80&w=1200&auto=format&fit=crop",
  pants_black_2:"https://images.unsplash.com/photo-1558507334-57300f59f137?q=80&w=1200&auto=format&fit=crop",

  // Footwear
  sandals_tan:  "https://images.unsplash.com/photo-1551806235-8f366b0b21b6?q=80&w=1200&auto=format&fit=crop",
  sandals_brown:"https://images.unsplash.com/photo-1528701800489-20be0b1a34e8?q=80&w=1200&auto=format&fit=crop",
  shoes_brown:  "https://images.unsplash.com/photo-1517260911025-87ca43f7d9c8?q=80&w=1200&auto=format&fit=crop",
  shoes_white:  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop",

  // Outer / Accessories
  bag_brown_1:  "https://images.unsplash.com/photo-1592878904946-b3cd2271a35b?q=80&w=1200&auto=format&fit=crop",
  bag_camel:    "https://images.unsplash.com/photo-1611175694980-3bfe9a5e5f2b?q=80&w=1200&auto=format&fit=crop",
  bag_brown_2:  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
  jacket_black: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
  coat_beige:   "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
};

export const ITEMS: Item[] = [
  { id: "it1", image: 'https://i.pinimg.com/1200x/b7/b4/34/b7b4344c8efc7c6e27316f348b59965f.jpg', category: "Top",       color: "Blue",  style: "Casual" },
  { id: "it2", image: 'https://i.pinimg.com/736x/bf/0e/a9/bf0ea9fb46c37f4b55175964bef14f81.jpg', category: "Bottom",    color: "Black", style: "Formal" },
  { id: "it3", image: 'https://i.pinimg.com/1200x/c2/4f/ad/c24fadba8c2a82831135de9c903a0333.jpg',   category: "Footwear",  color: "Brown", style: "Casual" },
  { id: "it4", image: 'https://i.pinimg.com/736x/e9/b5/15/e9b515044a93b1dd77000d4d09caaa67.jpg',    category: "Outerwear", color: "White", style: "Formal" },
  { id: "it5", image: 'https://i.pinimg.com/736x/05/02/cf/0502cf1bb7fdfc582318499396fe672b.jpg',  category: "Top",       color: "Blue",  style: "Formal" },
  { id: "it6", image: 'https://i.pinimg.com/1200x/e0/50/d0/e050d044bdd1143f98216c2dd4485b3f.jpg',    category: "Bottom",    color: "Blue",  style: "Casual" },
  { id: "it7", image: 'https://i.pinimg.com/736x/a7/7e/a4/a77ea491624074ce75a9cccd19c75bfd.jpg',  category: "Outerwear", color: "Black", style: "Formal" },
  { id: "it8", image: 'https://i.pinimg.com/1200x/f3/a5/7c/f3a57cda5b4675ac6b1364e34244a349.jpg',   category: "Footwear",  color: "White", style: "Casual" },
  { id: "it9", image: 'https://i.pinimg.com/736x/8d/0c/50/8d0c501b510a54c9f7070b042b6f87de.jpg',   category: "Top",       color: "White", style: "Formal" },
  { id: "it10", image: 'https://i.pinimg.com/736x/2d/df/ea/2ddfea659fca94a9e98c6a596052b352.jpg',category: "Bottom",    color: "Black", style: "Casual" },
  { id: "it11", image: 'https://i.pinimg.com/1200x/d3/56/85/d35685e2a6972c512361252a9843c7c9.jpg',  category: "Outerwear", color: "Brown", style: "Casual" },
  { id: "it12", image: 'https://i.pinimg.com/736x/6f/b0/42/6fb04204e76ad8af3563588e343249c0.jpg',  category: "Outerwear", color: "Brown", style: "Formal" },
];

const colorDot: Record<Item["color"], string> = {
  Black: "#222",
  Blue: "#4E8DFF",
  Brown: "#8B5E3C",
  White: "#EDEDED",
};

function Badge({
  text,
  beforeColor,
  size = "md",
}: {
  text: string;
  beforeColor?: string;
  size?: "md" | "sm";
}) {
  const isSm = size === "sm";
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: RAD.pill,
        paddingHorizontal: isSm ? 6 : 8,
        paddingVertical: isSm ? 4 : 6,
        flexDirection: "row",
        alignItems: "center",
        marginRight: isSm ? 4 : 6,
      }}
    >
      {beforeColor ? (
        <View
          style={{
            width: isSm ? 6 : 8,
            height: isSm ? 6 : 8,
            borderRadius: isSm ? 3 : 4,
            backgroundColor: beforeColor,
            marginRight: isSm ? 4 : 6,
          }}
        />
      ) : null}
      <Text
        style={{
          fontSize: isSm ? 10 : 12,
          fontWeight: "700",
          color: COLOR.text,
          letterSpacing: -0.2,
        }}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

function ColorDotChip({ color }: { color: Item["color"] }) {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: RAD.pill,
        paddingHorizontal: 6,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colorDot[color],
        }}
      />
    </View>
  );
}

function ItemCard({ item, index }: { item: Item; index: number }) {
  const ent = useEntrance(index);
  return (
    <Animated.View style={[{ width: "48%", marginBottom: 14 }, ent.style]}>
      <View
        style={[
          { backgroundColor: COLOR.surface, borderRadius: RAD.lg, padding: 8 },
          SHADOW_SM,
        ]}
      >
        {/* Clipping wrapper so overlay always stays inside the tile */}
        <View
          style={{
            borderRadius: RAD.md,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 140 }}
            resizeMode="cover"
          />

          {/* Compact, single-row overlay */}
          <View
            style={{
              position: "absolute",
              left: 8,
              right: 8,       // let chips use full width
              bottom: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Badge size="sm" text={item.category} />
            <Badge size="sm" text={item.style} />
            <ColorDotChip color={item.color} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// Add this just BELOW ItemCard
function ItemListRow({ item, index }: { item: Item; index: number }) {
  const ent = useEntrance(index);
  return (
    <Animated.View style={[{ marginBottom: 14 }, ent.style]}>
      <View
        style={[
          { backgroundColor: COLOR.surface, borderRadius: RAD.lg, padding: 8 },
          SHADOW_SM,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 180, borderRadius: RAD.md }}
          resizeMode="cover"
          accessibilityLabel={`${item.category}, ${item.style}, ${item.color}`}
        />
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          <Badge text={item.category} />
          <Badge text={item.style} />
          <Badge text={item.color} beforeColor={colorDot[item.color]} />
        </View>
      </View>
    </Animated.View>
  );
}

// Replace your entire ItemsGrid with this
function ItemsGrid({ onLoadingDone }: { onLoadingDone?: () => void }) {
  const [selected, setSelected] = React.useState<Set<Item["category"]>>(new Set());
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // fake loading for skeletons
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 20);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    onLoadingDone?.();
  }, [onLoadingDone]);

  const toggle = (c: Item["category"]) => {
    const next = new Set(selected);
    next.has(c) ? next.delete(c) : next.add(c);
    setSelected(next);
  };

  const filtered = React.useMemo(() => {
    if (!selected.size) return ITEMS;
    return ITEMS.filter((x) => selected.has(x.category));
  }, [selected]);

  // local (safe) list row to keep hooks outside loops
  function ItemListRow({ item, index }: { item: Item; index: number }) {
    const ent = useEntrance(index);
    return (
      <Animated.View style={[{ marginBottom: 14 }, ent.style]}>
        <View style={[{ backgroundColor: COLOR.surface, borderRadius: RAD.lg, padding: 8 }, SHADOW_SM]}>
          <View style={{ borderRadius: RAD.md, overflow: "hidden", position: "relative" }}>
            <Image source={{ uri: item.image }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
            <View style={{ position: "absolute", left: 8, right: 8, bottom: 8, flexDirection: "row", alignItems: "center" }}>
              <Badge size="sm" text={item.category} />
              <Badge size="sm" text={item.style} />
              {/* dot-only color to keep one row tidy */}
              <View style={{ backgroundColor: "rgba(255,255,255,0.92)", borderRadius: RAD.pill, paddingHorizontal: 6, paddingVertical: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorDot[item.color] }} />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View>
      {/* View mode toggle */}
      <View style={{ flexDirection: "row", marginBottom: 10, paddingRight: 20 }}>
        <Chip label="Grid" size="sm" active={viewMode === "grid"} onPress={() => setViewMode("grid")} />
        <Chip label="List" size="sm" active={viewMode === "list"} onPress={() => setViewMode("list")} />
      </View>

      {/* Category filter chips (compact) */}
      <View style={{ flexDirection: "row", marginBottom: 10, paddingRight: 20, flexWrap: "wrap" }}>
        {(["Top", "Bottom", "Footwear", "Outerwear"] as const).map((c) => (
          <Chip key={c} size="sm" label={c} active={selected.has(c)} onPress={() => toggle(c)} />
        ))}
      </View>

      {/* Active filter pills */}
      {selected.size > 0 && (
        <View style={{ flexDirection: "row", marginBottom: 12, flexWrap: "wrap" }}>
          {[...selected].map((c) => (
            <View
              key={c}
              style={{
                backgroundColor: COLOR.surface,
                borderColor: COLOR.chipBorder,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: RAD.pill,
                marginRight: 8,
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: COLOR.text }}>{c}</Text>
            </View>
          ))}
          <Pressable onPress={() => setSelected(new Set())} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: COLOR.textMuted }}>Clear</Text>
          </Pressable>
        </View>
      )}

      {/* Content: loading → empty → grid/list */}
      {loading ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: viewMode === "grid" ? "space-between" : "flex-start" }}>
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={{
                width: viewMode === "grid" ? "48%" : "100%",
                height: viewMode === "grid" ? 140 : 180,
                borderRadius: RAD.lg,
                backgroundColor: COLOR.surfaceMuted,
                marginBottom: 14,
              }}
            />
          ))}
        </View>
      ) : !filtered.length ? (
        <View style={{ alignItems: "center", paddingVertical: 40 }}>
          <Text style={{ color: COLOR.textMuted, fontWeight: "600" }}>No items match your filters</Text>
        </View>
      ) : viewMode === "grid" ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
          {filtered.map((it, idx) => (
            <ItemCard key={it.id} item={it} index={idx} />
          ))}
        </View>
      ) : (
        <View>
          {filtered.map((it, idx) => (
            <ItemListRow key={it.id} item={it} index={idx} />
          ))}
        </View>
      )}
    </View>
  );
}







/* =========================================================
   Bottom Tabs
   ========================================================= */
function BottomTabs({
  active = "bookmark",
  onHome,
}: {
  active?: "home" | "grid" | "bookmark";
  onHome?: () => void;
}) {
  const tint = (k: "home" | "grid" | "bookmark") =>
    active === k ? COLOR.accent : COLOR.textMuted;
  return (
    <View
      style={{
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLOR.divider,
        backgroundColor: COLOR.surface,
        paddingTop: 10,
        paddingBottom: 16,
        paddingHorizontal: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      accessibilityRole="tablist"
    >
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Home"
        style={{ padding: 8, minHeight: 44 }}
        onPress={onHome}   // <-- add this
      >
        <Feather name="home" size={26} color={tint("home")} />
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Collections"
        style={{ padding: 10, borderRadius: RAD.pill, backgroundColor: COLOR.surfaceMuted, minHeight: 44 }}
      >
        <MaterialCommunityIcons name="view-grid-outline" size={24} color={tint("grid")} />
      </Pressable>
      <Pressable accessibilityRole="tab" accessibilityLabel="Saved" style={{ padding: 8, minHeight: 44 }}>
        <MaterialCommunityIcons name="bookmark" size={26} color={tint("bookmark")} />
      </Pressable>
    </View>
  );
}

/* =========================================================
   Data (UPDATED: collections now have extraRight)
   ========================================================= */
export const COLLECTIONS: CollCard[] = [
  {
    id: "c1",
    title: "Work",
    images: {
      // use your test image as main
      tallLeft: "https://i.pinimg.com/736x/4e/95/c5/4e95c56c7957716f2dd4ccd4969f867b.jpg",
      topRight: 'https://i.pinimg.com/736x/ba/10/64/ba1064c5566a2500d80079428f3a38ad.jpg',
      bottomRight: 'https://i.pinimg.com/1200x/60/24/86/60248641866ca378f1078ff18bfcbd99.jpg',
      extraRight: 'https://i.pinimg.com/1200x/82/f1/af/82f1aff7e33964d7b2059eb6c0b09989.jpg',
    },
    bookmarked: true,
    tags: ["Office", "Blue", "Minimal"],
  },
  {
    id: "c2",
    title: "Leisure",
    images: {
      tallLeft: 'https://i.pinimg.com/736x/f5/c2/0f/f5c20f7a73f1c9325cbf619b6d92e15c.jpg',
      topRight: 'https://i.pinimg.com/736x/7a/71/c4/7a71c4e4e1e658b5b11396d28ef8e574.jpg',
      bottomRight: 'https://i.pinimg.com/736x/83/f0/86/83f086e3ef7a3949a22d37d090c7558d.jpg',
      extraRight: 'https://i.pinimg.com/1200x/5a/30/ef/5a30efb1ef9d1b1a68cca4bd9118546e.jpg',
    },
    tags: ["Weekend", "Soft"],
  },
  {
    id: "c3",
    title: "Design",
    images: {
      tallLeft: 'https://i.pinimg.com/736x/7e/77/9b/7e779b26a68a42664abf55bd0884a17b.jpg',
      topRight: 'https://i.pinimg.com/736x/58/3c/12/583c12cddb3518aa467ce9ab872c52a8.jpg',
      bottomRight: 'https://i.pinimg.com/736x/0e/b4/58/0eb458a4319ca9debd7e3eb7cc1a237d.jpg',
      extraRight: 'https://i.pinimg.com/736x/51/dc/8a/51dc8afaaa2493262f0d142d420732df.jpg',
    },
    tags: ["Studio", "Neutral"],
  },
  {
    id: "c4",
    title: "Work",
    images: {
      tallLeft: 'https://i.pinimg.com/1200x/0c/23/56/0c2356d9f738f780286bf0fdff4e82c1.jpg',
      topRight: 'https://i.pinimg.com/1200x/84/da/ee/84daee1fa901f4312952aafe54c670de.jpg',
      bottomRight: IMG.bag_brown_2,
      extraRight: 'https://i.pinimg.com/736x/be/e4/f1/bee4f12ebf4f1d6a666482632c903a09.jpg',
    },
    bookmarked: true,
    tags: ["Monochrome"],
  },
  {
    id: "c5",
    title: "Leisure",
    images: {
      tallLeft: 'https://i.pinimg.com/736x/5a/4b/ab/5a4bab5f3e59eabf85a71ffe2f8b7f86.jpg',
      topRight: 'https://i.pinimg.com/736x/71/10/49/711049c2e60a51de9aff26e105445a37.jpg',
      bottomRight: 'https://i.pinimg.com/1200x/a4/15/61/a415617218dc5273f8c2260d905cecd0.jpg',
      extraRight: 'https://i.pinimg.com/1200x/b3/1a/6f/b31a6fbfffeafc90406d4c3091b3d7b9.jpg',
    },
    tags: ["Soft", "Summer"],
  },
];

export const OUTFITS: Outfit[] = [
  {
    id: "o1",
    title: "City Casual",
    imgs: {
      top: 'https://i.pinimg.com/736x/d6/a3/b1/d6a3b1192701025c559bc6ee7b4468a3.jpg',
      bottom: 'https://i.pinimg.com/1200x/60/24/86/60248641866ca378f1078ff18bfcbd99.jpg',
      footwear: 'https://i.pinimg.com/1200x/c5/47/95/c54795471f82605fb1a633a25f7f041b.jpg',
      outerwear: 'https://i.pinimg.com/736x/84/7b/e5/847be591e3b76f7f4b86f3e221d2a168.jpg',
    },
    tags: ["Work", "Blue", "Minimal"],
  },
  {
    id: "o2",
    title: "Weekend Stroll",
    imgs: {
      top: 'https://i.pinimg.com/736x/66/fa/72/66fa72d8bf7cc018cfb3b66272a6d3e5.jpg',
      bottom: 'https://i.pinimg.com/1200x/63/a0/00/63a00073d70112b5b06627cd3811021a.jpg',
      footwear: 'https://i.pinimg.com/1200x/94/0a/f0/940af0f5972d0d956ac7f0eb6c09455c.jpg',
      outerwear: 'https://i.pinimg.com/736x/b5/33/89/b5338949dddc8d37287bfc9231e0cfef.jpg',
    },
    tags: ["Leisure", "Light"],
  },
  {
    id: "o3",
    title: "Monochrome",
    imgs: {
      top: 'https://i.pinimg.com/736x/43/71/e9/4371e9e09e566185d3c20f696005bc84.jpg',
      bottom: 'https://i.pinimg.com/736x/ef/62/2c/ef622cc489f83b6eefba054434b426be.jpg',
      footwear: 'https://i.pinimg.com/736x/c0/df/bd/c0dfbd1a31f36736781173181e4057b5.jpg',
      outerwear: 'https://i.pinimg.com/736x/10/01/98/10019834a2bc5d20863725ef4df5dfc3.jpg',
    },
    tags: ["Design", "Neutral"],
  },
];

/* =========================================================
   Sections
   ========================================================= */
function SparkleFab({ translate }: { translate: Animated.AnimatedInterpolation<number> }) {
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 18,
          bottom: 82,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: COLOR.surface,
          alignItems: "center",
          justifyContent: "center",
        },
        SHADOW_LG,
        { transform: [{ translateY: translate }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Magic sort"
    >
      <Text style={{ fontSize: 20 }}>✨</Text>
    </Animated.View>
  );
}

function CollectionsSection({ filterTag }: { filterTag?: string }) {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fabTranslate = scrollY.interpolate({
    inputRange: [0, 40, 140],
    outputRange: [0, 16, 40],
    extrapolate: "clamp",
  });

  // Show all if no filterTag; otherwise match by title ("Work/Leisure/Design") OR tags.
  const data = React.useMemo(
    () =>
      !filterTag
        ? COLLECTIONS
        : COLLECTIONS.filter(
            (c) => c.title === filterTag || c.tags?.includes(filterTag)
          ),
    [filterTag]
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        scrollEventThrottle={16}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
        snapToAlignment="start"       // <-- Step 3 (snap) will use this
        snapToInterval={CARD_SNAP}    // <-- Step 3 (snap)
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      >
        {data.map((c, i) => (
          <CollectionCard key={c.id} item={c} index={i} />
        ))}
      </Animated.ScrollView>
      <SparkleFab translate={fabTranslate} />
    </View>
  );
}


function OutfitsSection({ filterTag }: { filterTag?: string }) {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fabTranslate = scrollY.interpolate({
    inputRange: [0, 40, 140],
    outputRange: [0, 16, 40],
    extrapolate: "clamp",
  });

  // Outfits are tagged with "Work/Leisure/Design" already
  const data = React.useMemo(
    () =>
      !filterTag ? OUTFITS : OUTFITS.filter((o) => o.tags?.includes(filterTag)),
    [filterTag]
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        scrollEventThrottle={16}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
        snapToAlignment="start"       // <-- Step 3 (snap)
        snapToInterval={CARD_SNAP}    // <-- Step 3 (snap)
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      >
        {data.map((o, i) => (
          <OutfitCard key={o.id} item={o} index={i} />
        ))}
      </Animated.ScrollView>
      <SparkleFab translate={fabTranslate} />
    </View>
  );
}


function ItemsSection() {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fabTranslate = scrollY.interpolate({ inputRange: [0, 40, 140], outputRange: [0, 16, 40], extrapolate: "clamp" });

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        scrollEventThrottle={16}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.98}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      >
        <ItemsGrid />
      </Animated.ScrollView>
      <SparkleFab translate={fabTranslate} />
    </View>
  );
}

/* =========================================================
   Main
   ========================================================= */
// Only this function changed: hides the chip row on the "Items" segment
export default function App() {
  const [segment, setSegment] = React.useState<Segment>("Collections");
  const [activeChip, setActiveChip] = React.useState("Work");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.page }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        {/* Header */}
        <Text
          style={{
            fontSize: 30,
            fontWeight: "700",
            letterSpacing: -0.5,
            color: COLOR.text,
            marginBottom: 12,
          }}
        >
          Saved
        </Text>

        {/* Segmented control */}
        <Segmented value={segment} onChange={setSegment} />
        <View style={{ height: 12 }} />

        {/* Chips row — HIDDEN on Items */}
        {segment !== "Items" && (
          <View
            style={{
              flexDirection: "row",
              paddingRight: 20,
              marginBottom: 8,
              flexWrap: "nowrap",
            }}
          >
            <Chip
              label="+ Add new"
              kind="dashed"
              icon={<Feather name="plus" size={16} color={COLOR.text} />}
            />
            <Chip
              label="💼 Work"
              active={activeChip === "Work"}
              onPress={() => setActiveChip("Work")}
            />
            <Chip
              label="🏖 Leisure"
              active={activeChip === "Leisure"}
              onPress={() => setActiveChip("Leisure")}
            />
            <Chip
              label="🎀 Design"
              active={activeChip === "Design"}
              onPress={() => setActiveChip("Design")}
            />
          </View>
        )}
      </View>

      {/* Sections (leave as-is in your code) */}
{segment === "Collections" && <CollectionsSection filterTag={activeChip} />}
{segment === "Outfits" && <OutfitsSection filterTag={activeChip} />}

      {segment === "Items" && <ItemsSection />}

      <BottomTabs active="bookmark" onHome={() => setSegment("Collections")} />

    </SafeAreaView>
  );
}
