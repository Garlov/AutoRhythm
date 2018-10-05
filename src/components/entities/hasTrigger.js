import Phaser from 'phaser';

const hasTrigger = function hasTriggerFunc(state) {
    let parentScene;

    let triggerZone;
    let overlapsWith = [];
    let overlappedEntities = [];
    let x = 0;
    let y = 0;
    let w = 10;
    let h = 10;

    function createTriggerZone() {
        triggerZone = new Phaser.GameObjects.Zone(parentScene, x, y, w, h);
        parentScene.physics.add.existing(triggerZone, true);
    }

    function init(newParentScene) {
        parentScene = newParentScene;
        createTriggerZone();
    }

    function setSize(newW, newH) {
        w = newW;
        h = newH;
        triggerZone.setSize(w, h);
    }

    function setPosition(newX, newY) {
        x = newX;
        y = newY;
        triggerZone.setPosition(x, y);
    }

    function setOverlaps(bodies) {
        overlapsWith = bodies;
    }

    function addOverlapBody(body) {
        overlapsWith.push(body);
    }

    function isOverlappedByAny() {
        return overlappedEntities.length > 0;
    }

    /**
     * It should be possible to optimize state to avoid a double loop (or is it?).
     */
    function update() {
        const previous = overlappedEntities;
        overlappedEntities = [];
        parentScene.physics.overlap(triggerZone, overlapsWith, (zone, entity) => {
            overlappedEntities.push(entity);
        });

        overlappedEntities.forEach((entity) => {
            if (previous.indexOf(entity) === -1) {
                state.onEntityEnteredRange(entity);
            }
        });

        // If an entity was overlapped previously, but no longer, we emit an exit event.
        previous.forEach((entity) => {
            if (overlappedEntities.indexOf(entity) === -1) {
                state.onEntityLeftRange(entity);
            }
        });
    }

    return {
        // props
        // methods
        init,
        setSize,
        setPosition,
        setOverlaps,
        addOverlapBody,
        isOverlappedByAny,
        update,
        onEntityLeftRange: e => e,
        onEntityEnteredRange: e => e,
    };
};

export default hasTrigger;
