import logging
import hashlib

import yaml

import ycast.vtuner as vtuner
import ycast.generic as generic

ID_PREFIX = "MY"

config_file = 'stations.yml'


class Station:
    def __init__(self, uid, name, description, url, icon, genre, location, mime, bitrate, bookmark, id0):
        self.id = generic.generate_stationid_with_prefix(uid, ID_PREFIX)
        self.name = name
        self.description = description
        self.url = url
        self.trackurl = None
        self.icon = icon
        self.genre = genre
        self.location = location
        self.mime = mime
        self.bitrate = bitrate
        self.bookmark = bookmark
        self.id0 = id0

    def to_vtuner(self):
        return vtuner.Station(self.id, self.name, self.description, self.url, self.icon, self.genre, self.location, self.mime, self.bitrate, self.bookmark)

def set_config(config):
    global config_file
    if config:
        config_file = config
    if get_stations_yaml():
        return True
    else:
        return False


def get_station_by_id(uid):
    my_stations_yaml = get_stations_yaml()
    if my_stations_yaml:
        for category in my_stations_yaml:
            for station in get_stations_by_category(category):
                if uid == generic.get_stationid_without_prefix(station.id):
                    return station
    return None


def get_stations_yaml():
    try:
        with open(config_file, 'r') as f:
            my_stations = yaml.safe_load(f)
    except FileNotFoundError:
        logging.error("Station configuration '%s' not found", config_file)
        return None
    except yaml.YAMLError as e:
        logging.error("Station configuration format error: %s", e)
        return None
    return my_stations


def get_category_directories():
    my_stations_yaml = get_stations_yaml()
    categories = []
    if my_stations_yaml:
        for category in my_stations_yaml:
            categories.append(generic.Directory(category, len(get_stations_by_category(category))))
    return categories


def get_stations_by_category(category):
    my_stations_yaml = get_stations_yaml()
    stations = []
    if my_stations_yaml and category in my_stations_yaml:
        for station_name in my_stations_yaml[category]:
            station_url = my_stations_yaml[category][station_name]
            #if station_url:
            #    #print(station_url);
            #    for statiion_url in my_stations_yaml[category][station_name]:
            #        station_url = my_stations_yaml[category][station_name].get('url')
            #        station_icon = my_stations_yaml[category][station_name].get('icon')
            #        station_id0 = my_stations_yaml[category][station_name].get('id')

            #try:
            #    if isinstance('url', station_url):
            #        station_url = my_stations_yaml[category][station_name].get('url')
            #
            #except:
            #    print("Fehler beim Station.yml-parsing")

            try:
                items = station_url.items()
            except (AttributeError, TypeError):
                #non_items_behavior(any_object)
                station_id = str(get_checksum(station_name + station_url)).upper()
                station_icon = None
                station_description = category
                station_genre = category
                station_location = 'my stations'
                station_mime = None
                station_bitrate = None
                station_bookmark = category
                station_id0 = None
            else:  # no exception raised
                station_description = my_stations_yaml[category][station_name].get('description')
                station_icon = my_stations_yaml[category][station_name].get('icon')
                station_url = my_stations_yaml[category][station_name].get('url')
                station_id = str(get_checksum(station_name + station_url)).upper()
                station_genre = my_stations_yaml[category][station_name].get('genre')
                station_mime = my_stations_yaml[category][station_name].get('mime')
                station_bitrate = my_stations_yaml[category][station_name].get('bitrate')
                station_id0 = my_stations_yaml[category][station_name].get('id')
                #for item in items:
                #    print(item)

            # station_id = str(get_checksum(station_name + station_url)).upper()
            stations.append(Station(station_id,
                                    station_name,
                                    station_description,
                                    station_url,
                                    station_icon,
                                    station_genre,
                                    station_location,
                                    station_mime,
                                    station_bitrate,
                                    station_bookmark,
                                    station_id0)
                            )

    return stations


def get_checksum(feed, charlimit=12):
    hash_feed = feed.encode()
    hash_object = hashlib.md5(hash_feed)
    digest = hash_object.digest()
    xor_fold = bytearray(digest[:8])
    for i, b in enumerate(digest[8:]):
        xor_fold[i] ^= b
    digest_xor_fold = ''.join(format(x, '02x') for x in bytes(xor_fold))
    return digest_xor_fold[:charlimit]
