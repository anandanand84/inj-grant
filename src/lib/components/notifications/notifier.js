import { notification } from './store.js'

function noop() {

}

function notify (title, msg, type, timeout, link) {
  notification.set({ title, type, msg, timeout, link })
}

export function error (title, msg, timeout, link) {
  notify(title, msg, 'error', timeout, link)
}

export function warning (title, msg, timeout, link) {
  notify(title, msg, 'warning', timeout, link)
}

export function info (title, msg, timeout, link) {
  notify(title, msg, 'info', timeout, link)
}

export function success (title, msg, timeout, link) {
  notify(title, msg, 'success', timeout, link)
}