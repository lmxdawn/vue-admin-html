/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

export const footerTabLists = (cb) => fetch('/static/tempdata/footer.json', {}, 'GET', cb)
