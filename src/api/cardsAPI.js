import { supabase } from '../supabase.js'

const cardsAPI = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async create(userId) {
    const { data, error } = await supabase
      .from('cards')
      .insert({
        user_id: userId,
        text: '',
        count: 0,
      })
      .select()

    if (error) throw error
    return data[0]
  },

  async update(cardId, updates) {
    const { error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', cardId)

    if (error) throw error
  },

  async delete(cardId) {
    const { error } = await supabase.from('cards').delete().eq('id', cardId)

    if (error) throw error
  },
}

export default cardsAPI
