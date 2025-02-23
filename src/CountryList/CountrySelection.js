import React from "react";
import {
  View,
  TextInput,
  Image,
  SectionList,
  Text,
  TouchableOpacity
} from "react-native";
import styles from "./countrySelectionStyles";
import { searchIcon, countrySelectionTick, countries } from "./Constants";

/**
 * Item view
 * @param {*} params
 */
const ItemView = params => {
  let text = `${params.item.name} (+${params.item.callingCode})`;
  let selected = null;
  if (
    params.selected != null &&
    params.selected.callingCode === params.item.callingCode
  ) {
    selected = (
      <Image source={countrySelectionTick} style={styles.selectionTick} />
    );
  }
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemTextContainer}
        onPress={() => params.action(params.item)}
      >
        <Image source={{ uri: params.item.flag }} style={styles.flag} />
        <Text
          numberOfLines={1}
          style={[styles.itemText, params.itemTextCustom]}
        >
          {text}
        </Text>
        <View style={styles.selectionView}>{selected}</View>
      </TouchableOpacity>
      <View style={styles.itemSeparator} />
    </View>
  );
};

/**
 * Section header view
 * @param {*} params
 */
const SectionHeader = params => (
  <View style={[styles.sectionContainer, params.sectionCustom]}>
    <Text style={[styles.sectionHeader, params.titleCustom]}>
      {params.title}
    </Text>
  </View>
);

/**
 * Country selection screen
 */
export default class CountrySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    this.generateSectionData(countries);
  }

  /**
   * Change search text action
   */
  onChangeSearchText = text => {
    const filtered = countries.filter(
      country => country.name.toLowerCase().indexOf(text.toLowerCase()) > -1
    );
    this.generateSectionData(filtered);
  };

  /**
   * Generate section data from country list
   */
  generateSectionData(countryList) {
    const sections = [];
    const sectionHeaders = countryList.map(data => data.name.charAt(0));
    const uniqueHeaders = Array.from(new Set(sectionHeaders));

    uniqueHeaders.forEach(item => {
      const filtered = countryList.filter(
        country => country.name.charAt(0) === item
      );
      sections.push({ title: item, data: filtered });
    });
    this.setState({ sections });
  }

  render() {
    const { selected, action } = this.props;
    const { sections } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={[styles.searchContainer, this.props.searchContainerCustom]}
        >
          <View style={styles.searchView}>
            <Image source={searchIcon} style={styles.searchIcon} />
            <TextInput
              style={[styles.textInput, this.props.textInputCustom]}
              placeholder="Search"
              placeholderTextColor="#2d2926"
              enablesReturnKeyAutomatically
              clearButtonMode="while-editing"
              onChangeText={text => this.onChangeSearchText(text)}
              placeholderTextColor={this.props.placeholderTextColor}
            />
          </View>
        </View>
        <SectionList
          renderItem={({ item, index, section }) => (
            <ItemView
              item={item}
              index={index}
              section={section}
              action={item => action(item)}
              selected={selected}
              itemTextCustom={this.props.itemTextCustom}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader
              title={title}
              titleCustom={this.props.titleCustom}
              sectionCustom={this.props.sectionCustom}
            />
          )}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}
