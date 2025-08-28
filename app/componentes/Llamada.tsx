'use client'

import Image from 'next/image';
import { useState } from "react";

interface PokemonData {
  name: string
  id: number
  sprites: {
    front_default: string
  }
  types: {
    type: {
      name: string
    }
  }[]
}

interface Equipo {
  id: number
  nombre: string
  pokemons: PokemonData[]
}

export default function Llamada(){
    const [pokemon, setpokemon] = useState('')
    const [data, setdata] = useState<PokemonData | null>(null)
    const [equipoAct, setequipoaAct] = useState(1)
    const [cajas, setCajas] = useState<Equipo[]>([
      { id: 1, nombre: "Equipo 1", pokemons: [] },
      { id: 2, nombre: "Equipo 2", pokemons: [] },
      { id: 3, nombre: "Equipo 3", pokemons: [] }
    ])

    const Siguiente = () => {
      setequipoaAct(e => e === 3 ? 1 : e + 1)
    }

    const Atras = () => {
      setequipoaAct(e => e === 1 ? 3 : e - 1)
    }

    const Add = () => {
      if (!data) {
        alert("There are no Pokemons to add")
        return
      }

      const equipoActual = cajas.find(equipo => equipo.id === equipoAct)
      
      if (!equipoActual) return

      const pokemonYaExiste = equipoActual.pokemons.some(p => p.id === data.id)
      if (pokemonYaExiste) {
        alert("¡This pokemon is already on your team!")
        return
      }

      if (equipoActual.pokemons.length >= 6) {
        alert("¡Team is full.")
        return
      }

      const nuevasCajas = cajas.map(equipo => {
        if (equipo.id === equipoAct) {
          return {
            ...equipo,
            pokemons: [...equipo.pokemons, data]
          }
        }
        return equipo
      })

      setCajas(nuevasCajas)
      alert(`¡${data.name} was added successfully to team ${equipoAct}!`)
    }

    const eliminarPokemon = (pokemonId: number) => {
      const nuevasCajas = cajas.map(equipo => {
        if (equipo.id === equipoAct) {
          return {
            ...equipo,
            pokemons: equipo.pokemons.filter(poke => poke.id !== pokemonId)
          }
        }
        return equipo
      })
      
      setCajas(nuevasCajas)
      alert("Pokemon eliminado del equipo")
    }

    const seleccionarPokemon = (pokemon: PokemonData) => {
      setdata(pokemon)
    }

    const getTypeColor = (type: string) => {
      const colors: { [key: string]: string } = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
      }
      return colors[type] || '#777'
    }

    const buscar = async () => {
      if (!pokemon.trim()) {
        alert("Please enter a Pokemon name")
        return
      }

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
        if (!response.ok) {
          throw new Error('Pokemon not found')
        }
        const pokedata = await response.json()
        setdata(pokedata)
      } catch (error) {
        console.error('Error:', error)
        alert('Pokemon not found!')
        setdata(null)
      }
    }

    const actualizarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setpokemon(e.target.value)
    }

    const equipoActual = cajas.find(equipo => equipo.id === equipoAct)

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        
        <div className=" flex justify-center bg-gray-200 rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-center items-center space-x-4">
            <input 
              placeholder="Pokemon name ..." 
              className="rounded-lg border-2 border-gray-300 text-center p-2 w-full sm:w-64 focus:outline-none focus:border-blue-500"
              value={pokemon}
              onChange={actualizarInput}
            />
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              onClick={buscar}
            >
              Search
            </button>
            <button 
              onClick={Add} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 w-full sm:w-auto"
              disabled={!data} 
            >
              Add to Team
            </button>
          </div>
        </div>

        
        <div className="flex flex-col md:flex-row gap-6">
          
          
          <div className="w-full md:w-1/2 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Pokedex</h2>
            
            {data ? (
              <div className="flex flex-col items-center">
                <Image 
                    src={data.sprites.front_default} 
                    alt={data.name} 
                    width={192}
                    height={192}
                    className="w-48 h-48 mx-auto"
                />
                <h2 className="text-2xl font-bold text-center capitalize mt-4">{data.name}</h2>
                <p className="text-gray-600 text-center"># {data.id.toString().padStart(3, '0')}</p>
                
                <div className="flex justify-center gap-2 mt-4">
                  {data.types.map((typeInfo, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-white font-medium capitalize"
                      style={{ backgroundColor: getTypeColor(typeInfo.type.name) }} 
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p> Search for a Pokemon to see its information</p>
              </div>
            )}
          </div>

          
          <div className="w-full md:w-1/2 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Team {equipoAct}</h2>
            
            <div className="flex justify-center items-center space-x-4 mb-6">
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={Atras}
              >
                ←
              </button>
              
              <div className="border-2 border-gray-300 rounded-lg px-4 py-2">
                <span className="text-lg font-medium"> {equipoAct}</span>
              </div>
              
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={Siguiente}
              >
                →
              </button>
            </div>

            <div className="bg-red-100 border border-red-300 rounded-lg p-4 min-h-[300px]">
              {equipoActual && equipoActual.pokemons.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {equipoActual.pokemons.map((poke, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center shadow cursor-pointer">
                      <div 
                        onClick={() => seleccionarPokemon(poke)}
                        onDoubleClick={() => eliminarPokemon(poke.id)}
                        className="transition-transform hover:scale-105"
                      >
                        <Image 
                          src={poke.sprites.front_default} 
                          alt={poke.name} 
                          width={64}
                          height={64}
                          className="w-16 h-16 mx-auto"
                        />
                        <p className="text-sm font-medium capitalize">{poke.name}</p>
                        <p className="text-xs text-gray-500">#{poke.id.toString().padStart(3, '0')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p>There are not Pokemons here</p>
                  <p className="text-sm">Use the buttom above `Add to Team`` to add Pokemon</p>
                </div>
              )}
              
              {equipoActual && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  {equipoActual.pokemons.length}/6 Pokemon
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}