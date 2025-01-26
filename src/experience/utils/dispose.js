import { Mesh } from 'three'

export function dispose(object3D) {
  if (object3D instanceof Mesh) {
    object3D.geometry.dispose()

    for (const key in object3D.material) {
      const value = object3D.material[key]
      if (value && typeof value.dispose === 'function') {
        value.dispose()
      }
    }
  }
}
