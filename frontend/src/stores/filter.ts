import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    questionType: '',
    attitude: ''
  }),
  actions: {
    setQuestionType(type: string) {
      this.questionType = type
    },
    setAttitude(attitude: string) {
      this.attitude = attitude
    },
    resetFilters() {
      this.questionType = ''
      this.attitude = ''
    }
  }
})