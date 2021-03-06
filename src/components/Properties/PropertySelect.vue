<!--
  - @copyright Copyright (c) 2018 John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<div v-if="propModel" :class="`grid-span-${gridLength}`" class="property">
		<!-- title if first element -->
		<property-title v-if="isFirstProperty && propModel.icon" :icon="propModel.icon" :readable-name="propModel.readableName"
			:info="propModel.info" />

		<div class="property__row">
			<!-- if we do not support any type on our model but one is set anyway -->
			<div v-if="selectType" class="property__label">
				{{ selectType.name }}
			</div>

			<!-- no options, empty space -->
			<div v-else class="property__label">
				{{ propModel.readableName }}
			</div>

			<!-- delete the prop -->
			<button v-if="!isReadOnly" :title="t('contacts', 'Delete')" class="property__delete icon-delete"
				@click="deleteProperty" />

			<multiselect v-model="matchedOptions" :options="propModel.options" :placeholder="t('contacts', 'Select option')"
				:disabled="isSingleOption || isReadOnly" class="property__value" track-by="id"
				label="name" @input="updateValue" />
		</div>
	</div>
</template>

<script>
import PropertyMixin from 'Mixins/PropertyMixin'
import PropertyTitle from './PropertyTitle'

export default {
	name: 'PropertySelect',

	components: {
		PropertyTitle
	},

	mixins: [PropertyMixin],

	props: {
		value: {
			type: [Object, String],
			default: '',
			required: true
		}
	},

	computed: {
		gridLength() {
			let hasTitle = this.isFirstProperty && this.propModel.icon ? 1 : 0
			let isLast = this.isLastProperty ? 1 : 0
			// length is one & add one space at the end
			return hasTitle + 1 + isLast
		},
		// is there only one option available
		isSingleOption() {
			return this.propModel.options.length <= 1
		},

		// matching value to the options we provide
		matchedOptions: {
			get() {
				let selected = this.propModel.options.find(option => option.id === this.localValue)
				return selected || {
					id: this.localValue,
					name: this.localValue
				}
			},
			set(value) {
				this.localValue = value.id
			}
		}
	}
}

</script>
