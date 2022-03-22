import { ChannelName, NodeId } from 'commonInterface/kacheryTypes'
import QueryString from 'querystring'
import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export type Route = {
    page: 'home'
} | {
    page: 'channel',
    channelName: ChannelName
} | {
    page: 'channelNode',
    channelName: ChannelName,
    nodeId: NodeId
}

const useRoute = () => {
    const location = useLocation()
    const history = useHistory()
    const query = useMemo(() => (QueryString.parse(location.search.slice(1))), [location.search]);

    const p = location.pathname
    let route: Route = {page: 'home'}
    if (p.startsWith('/channel')) {
        const x = p.split('/')
        if (x.length === 3) {
            route = {
                page: 'channel',
                channelName: x[2] as any as ChannelName
            }
        }
        else if ((x.length === 5) && (x[3] === 'node')) {
            route = {
                page: 'channelNode',
                channelName: x[2] as any as ChannelName,
                nodeId: x[4] as any as NodeId
            }
        }
    }

    const setRoute = useCallback((route: Route) => {
        const query2 = {...query}
        let pathname2 = '/home'
        if (route.page === 'channel') {
            pathname2 = `/channel/${route.channelName}`
        }
        else if (route.page === 'channelNode') {
            pathname2 = `/channel/${route.channelName}/node/${route.nodeId}`
        }
        const search2 = queryString(query2)
        history.push({...location, pathname: pathname2, search: search2})
    }, [location, history, query])
    
    return {route, query, setRoute}
}

const queryString = (params: { [key: string]: string | string[] | undefined }) => {
    const keys = Object.keys(params)
    if (keys.length === 0) return ''
    return '?' + (
        keys.map((key) => {
            const v = params[key]
            if (v === undefined) {
                return encodeURIComponent(key) + '='
            }
            else if (typeof(v) === 'string') {
                return encodeURIComponent(key) + '=' + v
            }
            else {
                return v.map(a => (encodeURIComponent(key) + '=' + a)).join('&')
            }
        }).join('&')
    )
}

export default useRoute