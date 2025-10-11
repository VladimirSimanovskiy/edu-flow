import type { ReferenceApiService } from '@/types/reference-system';
import type { Subject } from '@/types/reference';

/**
 * Сервис для работы с API предметов
 * Следует принципу Single Responsibility - отвечает только за API операции с предметами
 * Следует принципу Dependency Inversion - зависит от абстракции ReferenceApiService
 */
export class SubjectService implements ReferenceApiService<Subject> {
	private baseUrl = '/api/subjects';

	async getAll(_params?: any): Promise<{ data: Subject[]; pagination?: any }> {
		const response = await fetch(this.baseUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch subjects: ${response.statusText}`);
		}
		const data = await response.json();
		return { data };
	}

	async getById(id: number): Promise<Subject> {
		const response = await fetch(`${this.baseUrl}/${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch subject: ${response.statusText}`);
		}
		return response.json();
	}

	async create(data: Omit<Subject, 'id'>): Promise<Subject> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to create subject: ${response.statusText}`);
		}
		return response.json();
	}

	async update(id: number, data: Partial<Subject>): Promise<Subject> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to update subject: ${response.statusText}`);
		}
		return response.json();
	}

	async delete(id: number): Promise<void> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error(`Failed to delete subject: ${response.statusText}`);
		}
	}
}
