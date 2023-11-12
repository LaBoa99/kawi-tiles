import Swal, { SweetAlertOptions } from 'sweetalert2';

// Confirmable is now a factory function, with an optional parameter object
export function Confirmable(options?: SweetAlertOptions, msg: string = '¿Estás seguro de realizar esta acción?', title: string = '¿Estás seguro?') {

    // our factory function will return our actual decorator function, but now we have
    // an actual options object to configure our alert box :)
    return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
        // the usual, caching the original implementation
        const originalMethod = descriptor.value;
        // default values for our config, we’ll overwrite this with our options parameter
        let config: SweetAlertOptions = {
            title: title,
            html: msg,
            showDenyButton: true,
            confirmButtonText: 'Sí',
            denyButtonText: 'No',
            icon: 'question'
        };

        // overwrite any keys passed in to our decorator in the config object
        if (options) {
            // @ts-ignore
            Object.keys(options).forEach((x: any) => config[x] = options[x]);
        }

        // from here it’s the same as before. We write the new implementation
        descriptor.value = async function (...args: any) {
            // ask for confirmation
            const res = await Swal.fire(config);
            if (res.isConfirmed) {
                // run original implementation if user confirms
                const result = originalMethod.apply(this, args);
                return result;
            }
        };
        return descriptor;

    };

}