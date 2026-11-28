"use client";

import Link from "next/link";
import {
  accommodationImage,
  floorLabel,
  floorList,
  type AvailabilityRow,
  type PublicDormitory,
} from "../accommodation/availability";
import { RequestAction } from "./requests";
import {
  RoomDetailsButton,
  RoomFilterButton,
  useRoomFilter,
} from "./room-interactions";
import { useAvailability } from "./room-availability";
import { SiteImage } from "./site-image";

const primary =
  "flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors";
const secondary =
  "flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors";

export function RoomFilters() {
  const { data, error } = useAvailability();
  if (!data || error) return null;
  return (
    <div
      className="mt-space-lg pt-space-md flex flex-wrap items-center gap-2"
      id="living-filter-group"
      aria-label="Filter accommodation"
    >
      <RoomFilterButton filter="all">
        All Spaces ({data.length})
      </RoomFilterButton>
      {data.map((row) => (
        <RoomFilterButton key={row.category_id} filter={row.category_code}>
          {row.category_name}
        </RoomFilterButton>
      ))}
    </div>
  );
}

export function AccommodationCount() {
  const { data, error } = useAvailability();
  return data && !error ? data.length + " Layouts" : "—";
}

function AccommodationCard({
  row,
  dorm,
}: {
  row: AvailabilityRow;
  dorm?: PublicDormitory;
}) {
  const isDorm = row.accommodation_type === "DORMITORY";
  const title = dorm?.name ?? row.category_name;
  const photo = accommodationImage(dorm?.image_url ?? row.image_url);
  const description = dorm?.description ?? row.description;
  const floor = dorm ? floorLabel(dorm.floor_number) : floorList(row.floors);
  const total = isDorm ? (dorm?.total_beds ?? row.total_beds) : row.total_rooms;
  const vacant = isDorm
    ? (dorm?.available_beds ?? row.available_beds)
    : row.available_rooms;
  const available = isDorm ? vacant : row.free_room_spaces;
  const unit = isDorm ? "beds" : "rooms";
  return (
    <article
      className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      data-accommodation-category={row.category_code}
    >
      <div className="relative h-60 w-full overflow-hidden bg-surface-container-high">
        {photo ? (
          <SiteImage
            src={photo}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <p className="absolute top-4 left-4 text-body-sm text-primary">
            Photo unavailable
          </p>
        )}
        <div
          className={
            "absolute inset-0 " +
            (photo
              ? "bg-gradient-to-t from-primary/75 via-transparent to-transparent"
              : "")
          }
        />
        <div
          className={
            "absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 " +
            (photo ? "text-on-primary" : "text-primary")
          }
        >
          <div>
            <p className="font-label-sm text-label-sm font-semibold">{floor}</p>
            <h3 className="font-headline-lg text-headline-lg font-bold">
              {title}
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 text-primary text-label-sm font-semibold">
            {available <= 0
              ? "Currently Unavailable"
              : isDorm || vacant > 0
                ? "Available"
                : "Shared places available"}
          </span>
        </div>
      </div>
      <div className="p-space-md flex-1 flex flex-col justify-between">
        <div>
          {description && (
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
              {description}
            </p>
          )}
          <p className="text-body-sm text-on-surface" aria-live="polite">
            Total {unit} <strong>{total}</strong> ·{" "}
            {isDorm ? "Available beds" : "Completely vacant rooms"}{" "}
            <strong>{vacant}</strong>
          </p>
          {!isDorm && (
            <p className="text-body-sm text-on-surface-variant">
              {row.free_room_spaces} remaining places including shared rooms
            </p>
          )}
          {!!row.public_features?.length && (
            <details className="mt-3 text-body-sm">
              <summary className="cursor-pointer font-semibold text-primary">
                Room features
              </summary>
              <ul className="mt-2 list-disc pl-5">
                {row.public_features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <div className="pt-space-sm flex flex-col sm:flex-row gap-2 flex-wrap">
          {isDorm ? (
            <RequestAction
              className={primary}
              kind="dormitory"
              category={row.category_name}
              categoryId={row.category_id}
            >
              Enquire
            </RequestAction>
          ) : (
            <>
              <RoomDetailsButton
                className={secondary}
                room={{
                  title: row.category_name,
                  category: floor,
                  description: description ?? "",
                  units: "",
                  code: row.category_code,
                  id: row.category_id,
                }}
              >
                View Details
              </RoomDetailsButton>
              <Link
                className={secondary}
                href={
                  row.category_code === "HARMONY"
                    ? "/rooms/harmony"
                    : "/rooms/visualizer"
                }
                prefetch={false}
              >
                Explore layout
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function RoomCatalogue() {
  const { data, loading, error, retry } = useAvailability();
  const filter = useRoomFilter();
  const list = error
    ? []
    : (data ?? []).filter(
        (row) => filter === "all" || row.category_code === filter,
      );
  const rooms = list.filter((item) => item.accommodation_type === "ROOM");
  const dorms = list.filter((item) => item.accommodation_type === "DORMITORY");
  return (
    <section
      className="w-full px-margin-mobile md:px-margin py-space-xl max-w-7xl mx-auto"
      aria-labelledby="accommodation-availability-title"
    >
      <h2
        id="accommodation-availability-title"
        className="font-headline-lg text-headline-lg text-primary mb-space-md"
      >
        Accommodation Availability
      </h2>
      {!data && loading && (
        <p role="status">Checking accommodation availability…</p>
      )}
      {error && (
        <p role="alert">
          Accommodation availability is temporarily unavailable.{" "}
          <button type="button" className="underline" onClick={retry}>
            Try again
          </button>
        </p>
      )}
      {data && !error && !list.length && (
        <p>No accommodation categories match this selection.</p>
      )}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg"
        id="spaces-grid"
      >
        {rooms.map((row) => (
          <AccommodationCard key={row.category_id} row={row} />
        ))}
      </div>
      {!!dorms.length && (
        <section className="mt-space-xl" aria-labelledby="public-dormitories">
          <h2
            id="public-dormitories"
            className="font-headline-lg text-headline-lg text-primary mb-space-md"
          >
            Dormitories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {dorms.flatMap((row) =>
              row.dormitories.length
                ? row.dormitories.map((dorm, index) => (
                    <AccommodationCard
                      key={row.category_id + "-" + dorm.name + "-" + index}
                      row={row}
                      dorm={dorm}
                    />
                  ))
                : [<AccommodationCard key={row.category_id} row={row} />],
            )}
          </div>
        </section>
      )}
    </section>
  );
}

export function AccommodationComparisonRows() {
  const { data, error } = useAvailability();
  if (!data || error)
    return (
      <tr>
        <td className="p-4" colSpan={6}>
          {error
            ? "Comparison temporarily unavailable."
            : "Loading comparison…"}
        </td>
      </tr>
    );
  const rooms = data.filter((row) => row.accommodation_type === "ROOM");
  if (!rooms.length)
    return (
      <tr>
        <td className="p-4" colSpan={6}>
          No room categories configured.
        </td>
      </tr>
    );
  return rooms.map((row) => (
    <tr
      key={row.category_id}
      className="hover:bg-surface-container-low transition-colors"
    >
      <td className="p-4 font-bold text-primary">{row.category_name}</td>
      <td className="p-4">{floorList(row.floors)}</td>
      <td className="p-4">{row.total_rooms}</td>
      <td className="p-4">{row.available_rooms}</td>
      <td className="p-4">{row.free_room_spaces}</td>
      <td className="p-4">
        {row.available_rooms > 0
          ? "Available"
          : row.free_room_spaces > 0
            ? "Shared places available"
            : "Currently Unavailable"}
      </td>
    </tr>
  ));
}

export function HomeRoomTiles() {
  const { data, loading, error, retry } = useAvailability();
  if (error)
    return (
      <p role="alert">
        Living spaces are temporarily unavailable.{" "}
        <button type="button" className="underline" onClick={retry}>
          Try again
        </button>
      </p>
    );
  if (!data && loading) return <p role="status">Loading living spaces…</p>;
  const rooms = data?.filter((row) => row.accommodation_type === "ROOM") ?? [];
  if (!rooms.length) return <p>No room categories are configured.</p>;
  return (
    <div className="home-refresh-grid home-rooms-grid">
      {rooms.map((row) => {
        const photo = accommodationImage(row.image_url);
        return (
          <article key={row.category_id} className="home-room-tile">
            {photo ? (
              <SiteImage
                src={photo}
                alt=""
                width={640}
                height={298}
                sizes="(min-width: 1000px) 33vw, (min-width: 620px) 50vw, 100vw"
                loading="lazy"
              />
            ) : (
              <div className="home-room-photo-placeholder bg-surface-container">
                Photo unavailable
              </div>
            )}
            <div className="home-room-copy">
              <h3 className="font-headline-sm text-headline-sm text-primary">
                {row.category_name}
              </h3>
              <p className="font-body-md text-body-md">
                {row.available_rooms}/{row.total_rooms} rooms vacant ·{" "}
                {row.free_room_spaces}{" "}
                {row.free_room_spaces === 1 ? "place left" : "places left"}
              </p>
            </div>
            <Link
              className="home-room-link font-label-md text-label-md"
              href="/rooms"
              data-path="rooms"
              prefetch={false}
            >
              View room options{" "}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
