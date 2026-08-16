import type { YardSectionState } from '../../preparation/types/preparation';
import { yardSectionDefinitions } from '../../preparation/data/yardSections';
import { getSectionOccupiedUnits } from '../../preparation/domain/preparationRules';
import type {
  YardPoint,
  YardSectionGeometry,
} from '../data/yardSectionGeometry';
import { LocomotiveView } from '../../rolling-stock/components/LocomotiveView';
import { WagonBlockView } from '../../rolling-stock/components/WagonBlockView';

type YardRollingStockProps = {
  section: YardSectionState;
  geometry: YardSectionGeometry;
};

const GAP = 4;
const MIN_LOCOMOTIVE_VISUAL_WIDTH = 34;

function distance(start: YardPoint, end: YardPoint) {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

function getPolylineLength(points: YardPoint[]) {
  return points.slice(1).reduce((total, point, index) => {
    return total + distance(points[index], point);
  }, 0);
}

function pointAlongPolyline(points: YardPoint[], offset: number) {
  if (points.length < 2) {
    return {
      x: points[0]?.x ?? 0,
      y: points[0]?.y ?? 0,
      angle: 0,
    };
  }

  let remaining = offset;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const segmentLength = distance(start, end);

    if (remaining <= segmentLength) {
      const ratio = segmentLength === 0 ? 0 : remaining / segmentLength;

      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
        angle:
          Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI),
      };
    }

    remaining -= segmentLength;
  }

  const last = points[points.length - 1];
  const beforeLast = points[points.length - 2];

  return {
    x: last.x,
    y: last.y,
    angle:
      Math.atan2(last.y - beforeLast.y, last.x - beforeLast.x) *
      (180 / Math.PI),
  };
}

export function YardRollingStock({
  section,
  geometry,
}: YardRollingStockProps) {
  const definition = yardSectionDefinitions[section.sectionId];
  const occupiedUnits = getSectionOccupiedUnits(section);

  const availableWidth = geometry.parkingPolyline
    ? getPolylineLength(geometry.parkingPolyline)
    : distance(geometry.parkingStart, geometry.parkingEnd);

  const capacity = definition.capacityReference;

  const visualFraction =
    capacity && capacity > 0
      ? Math.min(1, occupiedUnits / capacity)
      : occupiedUnits > 0
        ? 1
        : 0;

  const targetWidth = availableWidth * visualFraction;

  const locomotives = section.rollingStock.filter(
    (item) => item.kind === 'locomotive',
  );

  const wagonUnits = section.rollingStock.reduce(
    (total, item) =>
      total + (item.kind === 'wagon-block' ? item.quantity : 0),
    0,
  );

  const totalGaps = Math.max(0, section.rollingStock.length - 1) * GAP;

  const locomotiveReservedWidth =
    locomotives.length * MIN_LOCOMOTIVE_VISUAL_WIDTH;

  const widthAvailableForWagons = Math.max(
    0,
    targetWidth - totalGaps - locomotiveReservedWidth,
  );

  const positionedItems = section.rollingStock.reduce<
    Array<{
      item: (typeof section.rollingStock)[number];
      offset: number;
      width: number;
    }>
  >((items, item) => {
    const width =
      item.kind === 'locomotive'
        ? MIN_LOCOMOTIVE_VISUAL_WIDTH
        : wagonUnits > 0
          ? (widthAvailableForWagons * item.quantity) / wagonUnits
          : 0;

    const previous = items.at(-1);
    const offset = previous
      ? previous.offset + previous.width + GAP
      : 0;

    return [...items, { item, offset, width }];
  }, []);

  if (geometry.parkingPolyline) {
    return (
      <g className="yard-rolling-stock">
        {positionedItems.map(({ item, offset, width }) => {
          const centerOffset = offset + width / 2;
          const point = pointAlongPolyline(
            geometry.parkingPolyline!,
            centerOffset,
          );

          const itemX = -width / 2;

          return (
            <g
              key={item.id}
              transform={`translate(${point.x} ${point.y}) rotate(${point.angle})`}
            >
              {item.kind === 'locomotive' ? (
                <LocomotiveView
                  locomotive={item}
                  x={itemX}
                  y={0}
                  width={Math.max(MIN_LOCOMOTIVE_VISUAL_WIDTH, width)}
                  scale={1}
                />
              ) : (
                <WagonBlockView
                  wagonBlock={item}
                  x={itemX}
                  y={0}
                  width={Math.max(8, width)}
                />
              )}
            </g>
          );
        })}
      </g>
    );
  }

  const angle =
    Math.atan2(
      geometry.parkingEnd.y - geometry.parkingStart.y,
      geometry.parkingEnd.x - geometry.parkingStart.x,
    ) *
    (180 / Math.PI);

  return (
    <g
      className="yard-rolling-stock"
      transform={`translate(${geometry.parkingStart.x} ${geometry.parkingStart.y}) rotate(${angle})`}
    >
      {positionedItems.map(({ item, offset, width }) =>
        item.kind === 'locomotive' ? (
          <LocomotiveView
            key={item.id}
            locomotive={item}
            x={offset}
            y={0}
            width={MIN_LOCOMOTIVE_VISUAL_WIDTH}
            scale={1}
          />
        ) : (
          <WagonBlockView
            key={item.id}
            wagonBlock={item}
            x={offset}
            y={0}
            width={Math.max(8, width)}
          />
        ),
      )}
    </g>
  );
}
