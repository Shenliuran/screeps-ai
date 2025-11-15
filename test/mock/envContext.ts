import { EnvMethods } from '@/utils'
import { getMockGame, mockGetObjectById } from '.'

interface TestOptions {
    game?: Game
    rooms?: Room[]
    creeps?: Creep[]
}

/**
 * 创建测试用的环境上下文
 * @param moduleName 模块的名字
 */
export const getTestEnvContext = function (opt: TestOptions = {}): { mockGame: Game, env: EnvMethods } {
    const { game, rooms = [], creeps = [] } = opt
    const mockGame = getMockGame(game || {})
    rooms.forEach(room => {
        mockGame.rooms[room.name] = room
    })
    creeps.forEach(creep => {
        mockGame.creeps[creep.name] = creep
    })
    mockGame.getObjectById = mockGetObjectById(creeps)

    const mockFn = jest.fn(str => str)

    const env: EnvMethods = {
        getGame: () => mockGame,
        getRoomByName: roomName => mockGame.rooms[roomName],
        getCreepByName: creepName => mockGame.creeps[creepName],
        getPowerCreepByName: creepName => mockGame.powerCreeps?.[creepName],
        getObjectById: id => mockGame.getObjectById(id),
        getFlagByName: flagName => mockGame.flags[flagName],
        inInterval: interval => !!(mockGame.time % interval),
        colorful: { green: mockFn, red: mockFn, yellow: mockFn, blue: mockFn, bold: mockFn },
        log: { success: mockFn, warning: mockFn, error: mockFn, normal: mockFn }
    }

    return { mockGame, env }
}
