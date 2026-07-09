import { ref } from 'vue'
import { logger } from '@/utils/logger'
import { useAppwrite } from './useAppwrite'

export interface Service {
  $id?: string
  title: string
  description: string
  tags?: string[]
  benefits?: string[]
  icon?: any
  tag?: string
  deliverables?: string[]
  techStack?: string[]
  engagementInfo?: string
  projects?: { name: string; link: string; external: boolean }[]
}

export function useServices() {
  const { databases, databaseId, servicesCollectionId } = useAppwrite()
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchServices = async () => {
    loading.value = true
    error.value = null

    if (!databaseId || !servicesCollectionId) {
      logger.warn('Appwrite config missing. Studio will use fallback data.')
      loading.value = false
      return
    }

    try {
      const response = await databases.listDocuments(databaseId, servicesCollectionId, [])
      if (response.documents.length > 0) {
          services.value = response.documents.map(doc => ({
              $id: doc.$id,
              title: doc.title,
              description: doc.description,
              tags: doc.tags,
              benefits: doc.benefits
          }))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
          logger.error('Error fetching services:', err)
      } else {
          logger.error('Error fetching services:', String(err))
      }
    } finally {
      loading.value = false
    }
  }

  return { services, loading, error, fetchServices }
}
