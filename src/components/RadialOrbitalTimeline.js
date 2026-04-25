import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// 21st.dev / Radial Orbital Timeline (projeye uyarlanmış JS sürümü)
// Kaynak: https://21st.dev/community/components/jatin-yadav05/radial-orbital-timeline/default
export default function RadialOrbitalTimeline({ timelineData }) {
  const { t, i18n } = useTranslation();
  const [expandedItems, setExpandedItems] = useState({});
  const [viewMode] = useState("orbital");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [centerOffset] = useState({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [orbitRadius, setOrbitRadius] = useState(170);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key, 10) !== id) {
          newState[parseInt(key, 10)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulse = {};
        relatedItems.forEach((relId) => {
          newPulse[relId] = true;
        });
        setPulseEffect(newPulse);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = window.setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) window.clearInterval(rotationTimer);
    };
  }, [autoRotate, viewMode]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const minSide = Math.min(rect.width, rect.height);
      // Node (40px) + label boşluğu + güvenli padding
      const next = Math.max(90, Math.min(200, Math.floor(minSide / 2 - 70)));
      setOrbitRadius(next);
    };

    measure();

    // Daha stabil responsive davranış için ResizeObserver.
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const centerViewOnNode = (nodeId) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = orbitRadius * Math.cos(radian) + centerOffset.x;
    const y = orbitRadius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const currentLang = (i18n.resolvedLanguage || i18n.language || "tr").split("-")[0];
  const numberLocale = currentLang === "tr" ? "tr-TR" : "en-US";
  const formatNumber = (value) => new Intl.NumberFormat(numberLocale).format(value);

  return (
    <div
      className="w-full flex flex-col items-center justify-center overflow-visible"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        ref={stageRef}
        className="relative w-full max-w-[520px] md:max-w-[640px] aspect-square flex items-center justify-center"
      >
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Center orb (tema: yeşil) */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary via-primary-glow to-emerald-200 animate-pulse flex items-center justify-center z-10 shadow-neon">
            <div className="absolute w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>
            <div className="absolute w-[88px] h-[88px] sm:w-24 sm:h-24 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }}></div>
            <span className="material-symbols-outlined text-white text-[28px] sm:text-[30px] leading-none drop-shadow">
              eco
            </span>
          </div>

          <div
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${orbitRadius * 1.90}px`,
              height: `${orbitRadius * 1.90}px`,
            }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = !!expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = !!pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              zIndex: isExpanded ? 200 : position.zIndex,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute left-1/2 top-1/2 transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,230,80,0.18) 0%, rgba(255,255,255,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      isExpanded
                        ? "bg-primary text-white"
                        : isRelated
                        ? "bg-primary/30 text-white"
                        : "bg-black/30 text-white"
                    }
                    border-2 
                    ${
                      isExpanded
                        ? "border-primary shadow-lg shadow-primary/20"
                        : isRelated
                        ? "border-primary animate-pulse"
                        : "border-white/30"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-150" : ""}
                  `}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`
                    absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center
                    text-xs font-extrabold tracking-wider
                    transition-all duration-300
                    ${isExpanded ? "text-white scale-110" : "text-white"}
                  `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-black/50 backdrop-blur-lg border-white/20 shadow-xl shadow-black/40 overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className="px-2 text-xs text-background-dark bg-primary border-primary/60">
                          {t("common.live")}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm mt-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <div className="text-xl font-extrabold text-white">
                        {formatNumber(item.value)}
                        {item.unit ? (
                          <span className="text-sm font-bold text-white/70">
                            {" "}
                            {item.unit}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2">{item.content}</p>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <LinkIcon size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              {t("timeline.relatedNodes")}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-white/60"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

