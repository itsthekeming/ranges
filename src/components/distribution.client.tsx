import { type FeatureCollection } from 'geojson'
import { useMemo } from 'react'
import { DoubleSide, Mesh, MeshBasicMaterial } from 'three'
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry'
import { match } from 'ts-pattern'

interface DistributionProps {
  distribution: FeatureCollection
}

export function Distribution({ distribution }: DistributionProps) {
  const materials = useMemo(() => {
    return [
      new MeshBasicMaterial({
        side: DoubleSide,
        color: 'green',
        opacity: 0.1,
        transparent: true,
      }), // side material
      new MeshBasicMaterial({
        side: DoubleSide,
        color: 'red',
        opacity: 0.7,
        transparent: true,
      }), // bottom cap material
      new MeshBasicMaterial({
        color: 'red',
        opacity: 0.7,
        transparent: true,
        // wireframe: true,
      }), // top cap material
    ]
  }, [])

  const meshes = useMemo(() => {
    const alt = 1.001

    return distribution.features.flatMap(({ geometry }) => {
      const polygons = match(geometry)
        .with({ type: 'Polygon' }, (geometry) => [geometry.coordinates])
        .with({ type: 'GeometryCollection' }, (geometry) => []) // need to handle GeometryCollection flattening?
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .otherwise(() => geometry.coordinates)

      return polygons.map((coords) => {
        const conicPolygonGeometry = new ConicPolygonGeometry(coords, alt / 2, alt, true, true, true, 1)

        return new Mesh(conicPolygonGeometry, materials)
      })
    })
  }, [distribution, materials])

  return (
    <>
      {meshes.map((x) => (
        <primitive key={x.id} object={x} />
      ))}
    </>
  )
}
